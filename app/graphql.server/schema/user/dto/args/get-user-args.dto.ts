import { builder } from '~/graphql.server/builder';

export const GetUserArgs = builder.inputType('GetUserArgs', {
  fields: (t) => ({
    id: t.string({ required: true }),
  }),
});
