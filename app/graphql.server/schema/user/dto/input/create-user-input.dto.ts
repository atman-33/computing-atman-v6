import { builder } from '~/graphql.server/builder';
import { UserRole } from '../../types';

// CreateUserInput Dtoを定義
export const CreateUserInput = builder.inputType('CreateUserInput', {
  fields: (t) => ({
    name: t.string({ required: true }),
    email: t.string({ required: true }),
    role: t.field({ type: UserRole, required: true }),
    password: t.string({ required: true }),
  }),
});
