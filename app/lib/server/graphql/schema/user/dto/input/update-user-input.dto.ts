import { builder } from '~/lib/server/graphql/builder';

// UpdateUserInput Dtoを定義
export const UpdateUserInput = builder.inputType('UpdateUserInput', {
  fields: (t) => ({
    name: t.string({ required: false }),
    email: t.string({ required: false }),
    password: t.string({ required: false }),
  }),
});
