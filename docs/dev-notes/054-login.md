# ログイン処理

## ステップ

### インストール

```sh
npm i bcrypt jsonwebtoken
npm i -D @types/bcrypt @types/jsonwebtoken
```

- bcrypt: パスワードのハッシュ化や検証に使用されるライブラリ
- jsonwebtoken: JSON Web Token (JWT) を生成、署名、検証するためのライブラリ

```sh
npm i @whatwg-node/server-plugin-cookies
```

- WHATWG Node サーバープラグインの一部で、クッキーの取り扱いをサポートするためのプラグイン

```sh
npm i @pothos/plugin-simple-objects
```

- Pothos GraphQL スキーマビルダー用のプラグインで、単純なオブジェクト型を定義するプラグイン

> ログイン処理のような簡単な Mutation の場合、戻り値は単純なオブジェクトであることが多く、token のような文字列フィールドのみを持つケースが一般的です。
> @pothos/plugin-simple-objects を使うと、そうした単純な構造の型を短いコードで定義できます。

```sh
npm i @pothos/plugin-scope-auth
```

- GraphQL スキーマ内でスコープベースの認証を設定するためのプラグイン

### GraphQL YogaにCookiesプラグインを追加

`app/routes/api.graphql/route.ts`

```ts
import { useCookies } from '@whatwg-node/server-plugin-cookies';
// ...

const yoga = createYoga({
  schema,
  graphqlEndpoint: '/api/graphql', // GraphQL のエンドポイントを指定
+ // eslint-disable-next-line react-hooks/rules-of-hooks
+ plugins: [useCookies()],
});
```

### Contextを定義

Contextにログイン済みのユーザー情報を保存する。  

`app/graphql.server/context.ts`

```ts
import { User } from '@prisma/client';
import { type YogaInitialContext } from 'graphql-yoga';

export interface Context extends YogaInitialContext {
  user?: User;
}
```

`app/graphql.server/builder.ts`

```ts
import { Context } from './context';
// ...

export const builder = new SchemaBuilder<{
  // ...
  PrismaTypes: PrismaTypes;
+ Context: Context;
}>({
  plugins: [PrismaPlugin, RelayPlugin],
  // relayOptions: {},
  prisma: {
    client: prisma,
    dmmf: Prisma.dmmf,
  },
});
```

### loginミューテーションを作成

`app/graphql.server/builder.ts`

- プラグインに、`SimpleObjectsPlugin`を追加

```ts
// eslint-disable-next-line import/no-named-as-default
import PothosSimpleObjectsPlugin from '@pothos/plugin-simple-objects';
// ...

export const builder = new SchemaBuilder<{
  // ...
  PrismaTypes: PrismaTypes;
  Context: Context;
}>({
+ plugins: [PrismaPlugin, RelayPlugin, PothosSimpleObjectsPlugin],
  // relayOptions: {},
  prisma: {
    client: prisma,
    dmmf: Prisma.dmmf,
  },
});
```

`app/graphql.server/schema/auth/auth.mutation.ts`

- ログインMutationの戻り値のObjectの定義とログインMutationの処理を追加

```ts
import { CookieKeys } from '~/constants/cookie-keys';
import { builder } from '~/graphql.server/builder';
import { prisma } from '~/lib/prisma.server';
import { jwtSign, verifyPassword } from '~/utils/auth-utils';

const LoginType = builder.simpleObject('Login', {
  fields: (t) => ({
    token: t.string({ nullable: false }),
  }),
});

builder.mutationFields((t) => ({
  login: t.field({
    type: LoginType,
    args: {
      email: t.arg.string({ required: true }),
      password: t.arg.string({ required: true }),
    },
    resolve: async (_, args, ctx) => {
      const userWithPassword = await prisma.user.findUnique({
        where: { email: args.email ?? undefined },
        include: { password: true },
      });
      if (!userWithPassword || !userWithPassword.password) {
        throw new Error('Failed login');
      }

      const isVerifiedPassword = await verifyPassword({
        rawPassword: args.password,
        hashedPassword: userWithPassword.password.hashed,
      });
      if (!isVerifiedPassword) {
        throw new Error('Failed login');
      }

      const token = jwtSign(userWithPassword.id);
      await ctx.request.cookieStore?.set(CookieKeys.authToken, token);
      return { token };
    },
  }),
}));
```

> 上記実装に合わせて、下記のファイルを準備している。  
> `app/config/env.server.ts`でJWTキーを定義  
> `app/constants/cookie-keys.ts`でCookieのキーを定義  

### ユーザー情報をContextに渡す処理を追加

`app/routes/api.graphql/route.ts`

```ts
const yoga = createYoga({
  // ...
  context: async (ctx) => {
    const authToken =
      ctx.request.headers.get('Authorization')?.split(' ')?.[1] ||
      (await ctx.request.cookieStore?.get(CookieKeys.authToken))?.value;
    if (!authToken) {
      return { ...ctx };
    }
    const auth = jwtVerify(authToken);
    const user = await prisma.user.findUnique({
      where: { id: auth.sub! }, // sub: JWTトークンを識別する一意の識別子。ユーザーIDを格納している。
    });
    return { ...ctx, user };
  },
  // ...
});
```

// TODO: 認可処理を追加
