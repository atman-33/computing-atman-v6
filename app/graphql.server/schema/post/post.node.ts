import { builder } from '~/graphql.server/builder';

builder.prismaNode('Post', {
  id: { field: 'id' },
  findUnique: (id) => ({ id }),
  fields: (t) => ({
    title: t.exposeString('title'),
    emoji: t.exposeString('emoji'),
    content: t.exposeString('content'),
    published: t.exposeBoolean('published'),
    author: t.relation('author'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    // tags: t.relation('tags'),
  }),
});
