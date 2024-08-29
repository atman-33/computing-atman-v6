import { prisma } from '~/lib/prisma.server';
import { builder } from '../../builder';

// クエリフィールドを定義
builder.queryFields((t) => ({
  // 単一のユーザーを取得するためのクエリフィールド 'user' を定義
  user: t.prismaField({
    type: 'User', // フィールドの戻り値の型を 'User' に設定
    nullable: true, // フィールドがnullを返すことができるかどうかを設定
    // クエリ引数を定義
    args: {
      id: t.arg.id({ required: true }), // 'id' 引数を必須として定義（ID型）
    },
    // フィールドの解決関数
    resolve: (query, _, args) => {
      return prisma.user.findUnique({
        ...query, // Prismaのクエリオブジェクトを展開して使用（フィルタリング、ソートなど）
        where: { id: args.id }, // ユーザーのIDで検索
      });
    },
  }),

  // 複数のユーザーをページネーション可能な形で取得するためのクエリフィールド 'users' を定義
  users: t.prismaConnection({
    type: 'User', // フィールドの戻り値の型を 'User' に設定
    cursor: 'id', // ページネーションのためのカーソルを 'id' フィールドに設定
    // フィールドの解決関数
    resolve: (query) => prisma.user.findMany({ ...query }), // Prismaのクエリオブジェクトを展開して使用
    // 総ユーザー数を取得する関数
    totalCount: () => prisma.user.count(), // Prismaクライアントを使って、ユーザーの総数をカウント
  }),
}));
