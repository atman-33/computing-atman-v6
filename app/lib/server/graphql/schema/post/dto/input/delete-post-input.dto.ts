import { builder } from '~/lib/server/graphql/builder';

export const DeletePostInput = builder.inputType('DeletePostInput', {
  fields: (t) => ({
    id: t.string({ required: true }),
  }),
});
