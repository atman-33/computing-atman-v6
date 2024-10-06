import { builder } from '~/lib/server/graphql/builder';

builder.prismaObject('Tag', {
  fields: (t) => ({
    id: t.exposeString('id'),
    name: t.exposeString('name'),
    image: t.exposeString('image'),
  }),
});
