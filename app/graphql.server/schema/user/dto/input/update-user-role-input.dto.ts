import { builder } from '~/graphql.server/builder';
import { UserRole } from '../../types';

export const UpdateUserRoleInput = builder.inputType('UpdateUserRoleInput', {
  fields: (t) => ({
    id: t.string({ required: true }),
    role: t.field({ type: UserRole, required: true }),
  }),
});
