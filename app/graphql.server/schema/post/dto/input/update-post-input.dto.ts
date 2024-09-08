import { builder } from '~/graphql.server/builder';

export const UpdatePostInput = builder.inputType('UpdatePostInput', {
  fields: (t) => ({
    id: t.string({ required: true }),
    title: t.string({ required: true }),
    emoji: t.string({ required: true }),
    content: t.string({ required: true }),
    published: t.boolean({ required: true }),
    tagIds: t.stringList({ required: false }),
  }),
});
