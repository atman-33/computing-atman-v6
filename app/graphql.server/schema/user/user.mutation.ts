import { decodeGlobalID } from '@pothos/plugin-relay';
import { prisma } from '~/lib/prisma.server';
import { hashPassword } from '~/utils/auth-utils';
import { builder } from '../../builder';
import { CreateUserInput } from './dto/input/create-user-input.dto';
import { DeleteUserInput } from './dto/input/delete-user-input.dto';
import { UpdateUserInput } from './dto/input/update-user-input.dto';

// ミューテーションフィールドを定義
builder.mutationFields((t) => ({
  createUser: t.prismaField({
    type: 'User',
    nullable: false,
    args: {
      input: t.arg({
        type: CreateUserInput,
        required: true,
      }),
    },
    resolve: async (query, _, { input }) => {
      // バリデーションチェック: パスワードは4文字以上であること
      if (input.password.length < 4) {
        throw new Error('Password must be at least 4 characters long');
      }

      const createdUser = await prisma.user.create({
        data: {
          email: input.email,
          name: input.name,
          role: input.role,
        },
      });

      await prisma.password.create({
        data: {
          userId: createdUser.id,
          hashed: await hashPassword(input.password),
        },
      });

      return createdUser;
    },
  }),
  // ユーザー情報を更新するためのミューテーションフィールド 'updateUser' を定義
  updateUser: t.prismaField({
    type: 'User', // 戻り値の型を 'User' に設定
    nullable: true, // 更新対象が見つからない場合にnullを返すことができるように設定
    // ミューテーション引数を定義
    args: {
      input: t.arg({
        type: UpdateUserInput,
        required: true,
      }),
    },
    authScopes: { loggedIn: true },
    // フィールドの解決関数
    resolve: async (query, _, { input }, ctx) => {
      if (!ctx.user) {
        throw new Error('required ctx.user');
      }

      // 'password' の更新が指定された場合はハッシュ化（例: bcrypt など）
      const hashedPassword = input.password ? await hashPassword(input.password) : undefined;

      // ユーザー情報を更新
      const updatedUser = await prisma.user.update({
        ...query, // Prismaのクエリオブジェクトを展開して使用
        where: { id: ctx.user.id }, // 更新対象のユーザーIDで検索
        data: {
          name: input.name ?? undefined, // 'name' を更新（指定されていない場合は更新しない）
          email: input.email ?? undefined, // 'email' を更新（指定されていない場合は更新しない）
        },
      });

      // 'password' が指定されている場合、Passwordモデルを更新
      if (hashedPassword) {
        await prisma.password.upsert({
          where: { userId: ctx.user.id }, // ユーザーIDで検索
          update: { hashed: hashedPassword }, // 既存レコードがある場合は更新
          create: { userId: ctx.user.id, hashed: hashedPassword }, // ない場合は新規作成
        });
      }

      return updatedUser;
    },
  }),

  // ユーザーを削除するためのミューテーションフィールド 'deleteUser' を定義
  deleteUser: t.prismaField({
    type: 'User', // 戻り値の型を 'User' に設定
    nullable: true, // 削除対象が見つからない場合にnullを返すことができるように設定
    // ミューテーション引数を定義
    args: {
      input: t.arg({
        type: DeleteUserInput,
        required: true,
      }),
    },
    authScopes: {
      admin: true,
    },
    // フィールドの解決関数
    resolve: async (query, _, { input }) => {
      const { id: rawId } = decodeGlobalID(input.id); // Relay 形式のグローバルID をデコードしてDBのIDの形式を取り出す
      return prisma.user.delete({
        ...query, // Prismaのクエリオブジェクトを展開して使用
        where: { id: rawId }, // 削除対象のユーザーIDで検索
      });
    },
  }),
}));
