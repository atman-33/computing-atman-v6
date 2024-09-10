import { decodeGlobalID } from '@pothos/plugin-relay';
import { prisma } from '~/libs/server/prisma';
import { builder } from '../../builder';
import { GetUserArgs } from './dto/args/get-user-args.dto';

// クエリフィールドを定義
builder.queryFields((t) => ({
  // 単一のユーザーを取得するためのクエリフィールド 'user' を定義
  user: t.prismaField({
    type: 'User', // フィールドの戻り値の型を 'User' に設定
    nullable: true, // フィールドがnullを返すことができるかどうかを設定
    // クエリ引数を定義
    args: {
      args: t.arg({
        type: GetUserArgs,
        required: true,
      }),
    },
    authScopes: {
      admin: true,
      member: true,
    },
    // フィールドの解決関数
    resolve: async (query, _, { args }) => {
      const { id: rawId } = decodeGlobalID(args.id); // Relay 形式のグローバルID をデコードしてDBのIDの形式を取り出す
      return await prisma.user.findUnique({
        ...query, // Prismaのクエリオブジェクトを展開して使用（フィルタリング、ソートなど）
        where: { id: rawId }, // ユーザーのIDで検索
      });
    },
  }),

  // 複数のユーザーをページネーション可能な形で取得するためのクエリフィールド 'users' を定義
  users: t.prismaConnection({
    type: 'User', // フィールドの戻り値の型を 'User' に設定
    cursor: 'id', // ページネーションのためのカーソルを 'id' フィールドに設定
    authScopes: {
      admin: true,
    },
    // フィールドの解決関数
    resolve: async (query) => await prisma.user.findMany({ ...query }), // Prismaのクエリオブジェクトを展開して使用
    // 総ユーザー数を取得する関数
    totalCount: () => prisma.user.count(), // Prismaクライアントを使って、ユーザーの総数をカウント
  }),
}));
