import { builder } from '~/graphql.server/builder';

export const CreatePostInput = builder.inputType('CreatePostInput', {
  fields: (t) => ({
    title: t.string({ required: true }),
    emoji: t.string({ required: true }),
    content: t.string({ required: true }),
    tagIds: t.stringList({ required: false }),
  }),
});
