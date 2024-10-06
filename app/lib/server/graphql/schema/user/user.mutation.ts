import { decodeGlobalID } from '@pothos/plugin-relay';
import { prisma } from '~/lib/server/prisma';
import { hashPassword } from '~/utils/auth-utils';
import { builder } from '../../builder';
import { CreateUserInput } from './dto/input/create-user-input.dto';
import { DeleteUserInput } from './dto/input/delete-user-input.dto';
import { UpdateUserInput } from './dto/input/update-user-input.dto';
import { UpdateUserRoleInput } from './dto/input/update-user-role-input.dto';

builder.mutationFields((t) => ({
  /**
   * createUser
   */
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
          role: 'MEMBER',
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
  /**
   * updateUser
   */
  updateUser: t.prismaField({
    type: 'User',
    nullable: true,
    args: {
      input: t.arg({
        type: UpdateUserInput,
        required: true,
      }),
    },
    authScopes: { loggedIn: true },
    resolve: async (query, _, { input }, ctx) => {
      if (!ctx.user) {
        throw new Error('required ctx.user');
      }

      // 'password' の更新が指定された場合はハッシュ化（例: bcrypt など）
      const hashedPassword = input.password ? await hashPassword(input.password) : undefined;

      const updatedUser = await prisma.user.update({
        ...query,
        where: { id: ctx.user.id },
        data: {
          name: input.name ?? undefined,
          email: input.email ?? undefined,
        },
      });

      // 'password' が指定されている場合、Passwordモデルを更新
      if (hashedPassword) {
        await prisma.password.upsert({
          where: { userId: ctx.user.id },
          update: { hashed: hashedPassword },
          create: { userId: ctx.user.id, hashed: hashedPassword },
        });
      }

      return updatedUser;
    },
  }),
  /**
   * updateUserRole
   */
  updateUserRole: t.prismaField({
    type: 'User',
    nullable: true,
    args: {
      input: t.arg({
        type: UpdateUserRoleInput,
        required: true,
      }),
    },
    authScopes: {
      admin: true,
    },
    resolve: async (query, _, { input }) => {
      const { id: rawId } = decodeGlobalID(input.id);

      return await prisma.user.update({
        ...query,
        where: { id: rawId },
        data: {
          role: input.role,
        },
      });
    },
  }),
  /**
   * deleteUser
   */
  deleteUser: t.prismaField({
    type: 'User',
    nullable: true,
    args: {
      input: t.arg({
        type: DeleteUserInput,
        required: true,
      }),
    },
    authScopes: {
      admin: true,
    },
    resolve: async (query, _, { input }) => {
      const { id: rawId } = decodeGlobalID(input.id);
      return await prisma.user.delete({
        ...query,
        where: { id: rawId },
      });
    },
  }),
}));
