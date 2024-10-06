import { builder } from '~/lib/server/graphql/builder';

export const GetPostArgs = builder.inputType('GetPostArgs', {
  fields: (t) => ({
    id: t.string({ required: true }),
  }),
});
