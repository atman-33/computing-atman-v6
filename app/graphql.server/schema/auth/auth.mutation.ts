import { CookieKeys } from '~/constants/cookie-keys';
import { builder } from '~/graphql.server/builder';
import { prisma } from '~/lib/prisma.server';
import { jwtSign, verifyPassword } from '~/utils/auth-utils';

const LoginType = builder.simpleObject('Login', {
  fields: (t) => ({
    token: t.string({ nullable: false }),
  }),
});

const LogoutType = builder.simpleObject('Logout', {
  fields: (t) => ({
    success: t.boolean({ nullable: false }),
  }),
});

builder.mutationFields((t) => ({
  login: t.field({
    type: LoginType,
    args: {
      email: t.arg.string({ required: true }),
      password: t.arg.string({ required: true }),
    },
    resolve: async (_, args, ctx) => {
      const userWithPassword = await prisma.user.findUnique({
        where: { email: args.email ?? undefined },
        include: { password: true },
      });
      if (!userWithPassword || !userWithPassword.password) {
        throw new Error('Failed login');
      }

      const isVerifiedPassword = await verifyPassword({
        rawPassword: args.password,
        hashedPassword: userWithPassword.password.hashed,
      });
      if (!isVerifiedPassword) {
        throw new Error('Failed login');
      }

      const token = jwtSign(userWithPassword.id);
      // クッキーストアに認証トークンをセット
      await ctx.request.cookieStore?.set(CookieKeys.authToken, token);
      return { token };
    },
  }),
  logout: t.field({
    type: LogoutType,
    resolve: async (_, __, ctx) => {
      // クッキーストアから認証トークンを削除
      await ctx.request.cookieStore?.delete(CookieKeys.authToken);

      // 成功レスポンスを返す
      return { success: true };
    },
  }),
}));
