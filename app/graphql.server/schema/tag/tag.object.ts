import { builder } from '~/graphql.server/builder';

builder.prismaObject('Tag', {
  fields: (t) => ({
    id: t.exposeString('id'),
    name: t.exposeString('name'),
    image: t.exposeString('image'),
  }),
});
