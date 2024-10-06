import { builder } from '~/lib/server/graphql/builder';

// NOTE: post nodeで、tagのリレーションを利用するために必要
builder.prismaObject('PostTag', {
  fields: (t) => ({
    id: t.exposeString('id'),
    post: t.relation('post'), // Post モデルとのリレーション
    tag: t.relation('tag'), // Tag モデルとのリレーション
  }),
});
