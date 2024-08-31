import { CookieKeys } from '~/constants/cookie-keys';
import { builder } from '~/graphql.server/builder';
import { prisma } from '~/lib/prisma.server';
import { jwtSign, verifyPassword } from '~/utils/auth-utils';

const LoginType = builder.simpleObject('Login', {
  fields: (t) => ({
    token: t.string({ nullable: false }),
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
      await ctx.request.cookieStore?.set(CookieKeys.authToken, token);
      return { token };
    },
  }),
}));
