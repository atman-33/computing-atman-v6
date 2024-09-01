import { decodeGlobalID } from '@pothos/plugin-relay';
import { prisma } from '~/lib/prisma.server';
import { hashPassword } from '~/utils/auth-utils';
import { builder } from '../../builder';

// ユーザーロールを定義
const UserRole = builder.enumType('UserRole', {
  values: ['MEMBER', 'ADMIN'] as const,
});

// UpdateUserInput Dtoを定義
const UpdateUserInput = builder.inputType('UpdateUserInput', {
  fields: (t) => ({
    id: t.string({ required: true }),
    name: t.string({ required: false }),
    email: t.string({ required: false }),
    role: t.field({ type: UserRole, required: false }),
    password: t.string({ required: false }),
  }),
});

// DeleteUserInput Dtoを定義
const DeleteUserInput = builder.inputType('DeleteUserInput', {
  fields: (t) => ({
    id: t.string({ required: true }),
  }),
});

// ミューテーションフィールドを定義
builder.mutationFields((t) => ({
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
    resolve: async (query, _, args) => {
      // 'password' の更新が指定された場合はハッシュ化（例: bcrypt など）
      const hashedPassword = args.input.password
        ? await hashPassword(args.input.password)
        : undefined;

      const { id: rawId } = decodeGlobalID(args.input.id); // Relay 形式のグローバルID をデコードしてDBのIDの形式を取り出す
      // ユーザー情報を更新
      const updatedUser = await prisma.user.update({
        ...query, // Prismaのクエリオブジェクトを展開して使用
        where: { id: rawId }, // 更新対象のユーザーIDで検索
        data: {
          name: args.input.name ?? undefined, // 'name' を更新（指定されていない場合は更新しない）
          email: args.input.email ?? undefined, // 'email' を更新（指定されていない場合は更新しない）
          role: args.input.role ?? undefined, // 'role' を更新（指定されていない場合は更新しない）
        },
      });

      // 'password' が指定されている場合、Passwordモデルを更新
      if (hashedPassword) {
        await prisma.password.upsert({
          where: { userId: rawId }, // ユーザーIDで検索
          update: { hashed: hashedPassword }, // 既存レコードがある場合は更新
          create: { userId: args.input.id, hashed: hashedPassword }, // ない場合は新規作成
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
    // フィールドの解決関数
    resolve: async (query, _, args) => {
      const { id: rawId } = decodeGlobalID(args.input.id); // Relay 形式のグローバルID をデコードしてDBのIDの形式を取り出す
      return prisma.user.delete({
        ...query, // Prismaのクエリオブジェクトを展開して使用
        where: { id: rawId }, // 削除対象のユーザーIDで検索
      });
    },
  }),
}));
