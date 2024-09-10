import { builder } from '~/libs/server/graphql/builder';

export const GetUserArgs = builder.inputType('GetUserArgs', {
  fields: (t) => ({
    id: t.string({ required: true }),
  }),
});
