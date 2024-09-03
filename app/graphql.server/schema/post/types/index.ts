import { builder } from '~/graphql.server/builder';

export const PostStatus = builder.enumType('PostStatus', {
  values: ['DRAFT', 'PUBLIC'] as const,
});
