import { builder } from '~/graphql.server/builder';

export const DeleteTagInput = builder.inputType('DeleteTagInput', {
  fields: (t) => ({
    id: t.string({ required: true }),
  }),
});
