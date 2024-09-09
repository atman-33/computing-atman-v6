import { builder } from '~/graphql.server/builder';

export const GetTagArgs = builder.inputType('GetTagArgs', {
  fields: (t) => ({
    id: t.string({ required: true }),
  }),
});
