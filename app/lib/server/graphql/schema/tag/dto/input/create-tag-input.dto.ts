import { builder } from '~/lib/server/graphql/builder';

export const CreateTagInput = builder.inputType('CreateTagInput', {
  fields: (t) => ({
    name: t.string({ required: true }),
    image: t.string({ required: false }),
  }),
});
