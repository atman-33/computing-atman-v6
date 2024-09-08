import { builder } from '~/graphql.server/builder';
import { PostStatus } from '../../types';

export const UpdatePostInput = builder.inputType('UpdatePostInput', {
  fields: (t) => ({
    id: t.string({ required: true }),
    title: t.string({ required: true }),
    content: t.string({ required: true }),
    status: t.field({ type: PostStatus, required: true }),
  }),
});
