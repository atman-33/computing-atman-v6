import { builder } from '~/libs/server/graphql/builder';

// CreateUserInput Dtoを定義
export const CreateUserInput = builder.inputType('CreateUserInput', {
  fields: (t) => ({
    name: t.string({ required: true }),
    email: t.string({ required: true }),
    password: t.string({ required: true }),
  }),
});
