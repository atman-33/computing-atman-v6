import { builder } from '~/graphql.server/builder';

// ユーザーロールを定義
export const UserRole = builder.enumType('UserRole', {
  values: ['MEMBER', 'ADMIN'] as const,
});
