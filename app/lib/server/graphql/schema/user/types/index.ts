import { builder } from '~/lib/server/graphql/builder';

// ユーザーロールを定義
export const UserRole = builder.enumType('UserRole', {
  values: ['MEMBER', 'ADMIN'] as const,
});
