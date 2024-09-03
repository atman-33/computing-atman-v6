import { builder } from '~/graphql.server/builder';

// DeleteUserInput Dtoを定義
export const DeleteUserInput = builder.inputType('DeleteUserInput', {
  fields: (t) => ({
    id: t.string({ required: true }),
  }),
});
