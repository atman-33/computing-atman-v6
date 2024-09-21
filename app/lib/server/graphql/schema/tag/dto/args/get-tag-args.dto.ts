import { builder } from '~/lib/server/graphql/builder';

export const GetTagArgs = builder.inputType('GetTagArgs', {
  fields: (t) => ({
    id: t.string({ required: true }),
  }),
});
