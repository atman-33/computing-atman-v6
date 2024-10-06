import { builder } from '../../builder';

// PrismaのUserモデルに基づいたGraphQLノードを定義
builder.prismaNode('User', {
  id: { field: 'id' }, // ノードのIDフィールドをUserモデルの'id'フィールドにマップ
  fields: (t) => ({
    name: t.exposeString('name'), // Userモデルの'name'フィールドをGraphQLでString型として公開
    email: t.exposeString(
      'email' /*, {
      authScopes: { admin: true, member: true },
    }*/,
    ),
    role: t.exposeString('role'),
    // Userモデルの'relation'フィールド(posts)をページネーション可能な接続として公開
    posts: t.relatedConnection('posts', {
      cursor: 'id', // ページネーションのためのカーソルをPostモデルの'id'フィールドに設定
      totalCount: true, // 総投稿数を返す機能を有効にする
    }),
  }),
});
