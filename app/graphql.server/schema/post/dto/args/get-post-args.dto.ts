import { builder } from '~/graphql.server/builder';

export const GetPostArgs = builder.inputType('GetPostArgs', {
  fields: (t) => ({
    id: t.string({ required: true }),
  }),
});
