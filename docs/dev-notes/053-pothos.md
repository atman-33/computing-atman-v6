# Pothosセットアップ

## 参考URL

- [PrismaとPothosでコード生成を使いながら効率よくGraphQLサーバーを作ってみる](https://zenn.dev/poyochan/articles/9f22799853784d#pothos%E3%81%AE%E3%82%B9%E3%82%AD%E3%83%BC%E3%83%9E%E3%83%93%E3%83%AB%E3%83%80)

## ステップ

### インストール

```sh
npm i @pothos/core @pothos/plugin-prisma @pothos/plugin-relay graphql-scalars
```

- @pothos/plugin-prisma: prismaの型を利用するために必要
- @pothos/plugin-relay: ページネーションを実装ために必要
- graphql-scalars: DateTime型を利用するために必要

### prisma.schemaの設定を変更

`prisma/schema.prisma`

- prisma-pothos-types の設定を追加

```s
generator pothos {
  provider     = "prisma-pothos-types"
}
```

```sh
npx prisma generate
```

### スキーマビルダー実装

`app/graphql.server/builder.ts`

```ts
import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from '@pothos/plugin-prisma/generated';
import RelayPlugin from '@pothos/plugin-relay';
import { Prisma } from '@prisma/client';
import { DateTimeResolver } from 'graphql-scalars';
import { prisma } from '~/lib/prisma.server';

export const builder = new SchemaBuilder<{
  Scalars: {
    DateTime: {
      Input: Date;
      Output: Date;
    };
  };
  Connection: {
    totalCount: number | (() => number | Promise<number>);
  };
  PrismaTypes: PrismaTypes;
}>({
  plugins: [PrismaPlugin, RelayPlugin],
  relay: {},
  prisma: {
    client: prisma,
    dmmf: Prisma.dmmf,
  },
});

builder.queryType();
builder.mutationType();

builder.addScalarType('DateTime', DateTimeResolver, {});
```

### モデル毎のGraphQLを定義

#### GrqphQLノードを実装

`app/graphql.server/schema/user/user.node.ts`

```ts
import { builder } from '../../builder';

// PrismaのUserモデルに基づいたGraphQLノードを定義
builder.prismaNode('User', {
  id: { field: 'id' }, // ノードのIDフィールドをUserモデルの'id'フィールドにマップ
  fields: (t) => ({
    name: t.exposeString('name'), // Userモデルの'name'フィールドをGraphQLでString型として公開
    // Userモデルの'relation'フィールド(posts)をページネーション可能な接続として公開
    posts: t.relatedConnection('posts', {
      cursor: 'id', // ページネーションのためのカーソルをPostモデルの'id'フィールドに設定
      totalCount: true, // 総投稿数を返す機能を有効にする
    }),
  }),
});
```

#### クエリフィールドを実装

`app/graphql.server/schema/user/user.query.ts`

```ts
import { decodeGlobalID } from '@pothos/plugin-relay';
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
      const { id: rawId } = decodeGlobalID(args.id); // Relay 形式のグローバルID をデコードしてDBのIDの形式を取り出す
      return prisma.user.findUnique({
        ...query, // Prismaのクエリオブジェクトを展開して使用（フィルタリング、ソートなど）
        where: { id: rawId }, // ユーザーのIDで検索
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
```

#### ミューテーションフィールドを実装

`app/graphql.server/schema/user/user.mutation.ts`

```ts
import { decodeGlobalID } from '@pothos/plugin-relay';
import { prisma } from '~/lib/prisma.server';
import { hashPassword } from '~/utils/auth-utils';
import { builder } from '../../builder';

// ユーザーロールを定義
const UserRole = builder.enumType('UserRole', {
  values: ['MEMBER', 'ADMIN'] as const,
});

// UpdateUserInput Dtoを定義
const UpdateUserInput = builder.inputType('UpdateUserInput', {
  fields: (t) => ({
    id: t.string({ required: true }),
    name: t.string({ required: false }),
    email: t.string({ required: false }),
    role: t.field({ type: UserRole, required: false }),
    password: t.string({ required: false }),
  }),
});

// DeleteUserInput Dtoを定義
const DeleteUserInput = builder.inputType('DeleteUserInput', {
  fields: (t) => ({
    id: t.string({ required: true }),
  }),
});

// ミューテーションフィールドを定義
builder.mutationFields((t) => ({
  // ユーザー情報を更新するためのミューテーションフィールド 'updateUser' を定義
  updateUser: t.prismaField({
    type: 'User', // 戻り値の型を 'User' に設定
    nullable: true, // 更新対象が見つからない場合にnullを返すことができるように設定
    // ミューテーション引数を定義
    args: {
      input: t.arg({
        type: UpdateUserInput,
        required: true,
      }),
    },
    // フィールドの解決関数
    resolve: async (query, _, args) => {
      // 'password' の更新が指定された場合はハッシュ化（例: bcrypt など）
      const hashedPassword = args.input.password
        ? await hashPassword(args.input.password)
        : undefined;

      const { id: rawId } = decodeGlobalID(args.input.id); // Relay 形式のグローバルID をデコードしてDBのIDの形式を取り出す
      // ユーザー情報を更新
      const updatedUser = await prisma.user.update({
        ...query, // Prismaのクエリオブジェクトを展開して使用
        where: { id: rawId }, // 更新対象のユーザーIDで検索
        data: {
          name: args.input.name ?? undefined, // 'name' を更新（指定されていない場合は更新しない）
          email: args.input.email ?? undefined, // 'email' を更新（指定されていない場合は更新しない）
          role: args.input.role ?? undefined, // 'role' を更新（指定されていない場合は更新しない）
        },
      });

      // 'password' が指定されている場合、Passwordモデルを更新
      if (hashedPassword) {
        await prisma.password.upsert({
          where: { userId: rawId }, // ユーザーIDで検索
          update: { hashed: hashedPassword }, // 既存レコードがある場合は更新
          create: { userId: args.input.id, hashed: hashedPassword }, // ない場合は新規作成
        });
      }

      return updatedUser;
    },
  }),

  // ユーザーを削除するためのミューテーションフィールド 'deleteUser' を定義
  deleteUser: t.prismaField({
    type: 'User', // 戻り値の型を 'User' に設定
    nullable: true, // 削除対象が見つからない場合にnullを返すことができるように設定
    // ミューテーション引数を定義
    args: {
      input: t.arg({
        type: DeleteUserInput,
        required: true,
      }),
    },
    // フィールドの解決関数
    resolve: async (query, _, args) => {
      const { id: rawId } = decodeGlobalID(args.input.id); // Relay 形式のグローバルID をデコードしてDBのIDの形式を取り出す
      return await prisma.user.delete({
        ...query, // Prismaのクエリオブジェクトを展開して使用
        where: { id: rawId }, // 削除対象のユーザーIDで検索
      });
    },
  }),
}));
```

### スキーマビルダーでGraphQLスキーマを生成

`app/graphql.server/schema/index.ts`

```ts
import { builder } from '../builder';
import './post';
import './user';

export const schema = builder.toSchema();
```

### GraphQL YogaでGraphQLスキーマを読み込み

`app/routes/api.graphql/route.ts`

```ts
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { createYoga } from 'graphql-yoga';
import { schema } from '~/graphql.server/schema';

const yoga = createYoga({
  schema,
  graphqlEndpoint: '/api/graphql', // GraphQL のエンドポイントを指定
});

export async function action({ request, context }: ActionFunctionArgs) {
  const response = await yoga.handleRequest(request, context);
  return new Response(response.body, response);
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  const response = await yoga.handleRequest(request, context);
  return new Response(response.body, response);
}
```
