import { builder } from '~/graphql.server/builder';

export const DeletePostInput = builder.inputType('DeletePostInput', {
  fields: (t) => ({
    id: t.string({ required: true }),
  }),
});
