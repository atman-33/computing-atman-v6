# GraphQL codegen セットアップ

## 参考URL

- [URQL and TypeScript](https://commerce.nearform.com/open-source/urql/docs/basics/typescript-integration/)

## ステップ

### GraphQL スキーマファイル出力機能を追加

- GraphQLスキーマ出力処理を追加する。

`tools/export-schema.ts`

```ts
import fs from 'fs';
import { lexicographicSortSchema, printSchema } from 'graphql';
import path from 'path';
import { schema } from '~/libs/server/graphql/schema';

const main = async () => {
  const outputFile = './codegen/schema.graphql';

  const schemaAsString = printSchema(lexicographicSortSchema(schema));
  await fs.writeFileSync(outputFile, schemaAsString);
  console.log(`🌙${path.resolve(outputFile)} is created!`);
};

main();
```

- package.json にスクリプトを追加する。

```json
  "scripts": {
    // ...
    "---- GRAPHQL SECTION ----": "---- ---- ---- ---- ----",
    "graphql:schema": "tsx ./tools/export-schema.ts",
```

### インストール

```sh
npm install -D graphql typescript @graphql-codegen/cli @graphql-codegen/client-preset
npm install -D @parcel/watcher
```

> `@parcel/watcher`はwatchモードを利用する際に必要となる。

### codegen configファイルを作成

`codegen/codegen.ts`

```ts
import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'codegen/schema.graphql',
  overwrite: true,
  documents: ['app/**/*.tsx', 'app/**/*.ts'],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    './app/gql/': {
      preset: 'client',
      plugins: [],
      config: {
        scalars: { DateTime: 'string' },
      },
    },
  },
};

export default config;
```

### package.jsonにスクリプトを追加

`package.json`

```json
  "scripts": {
    // ...
    "graphql:codegen": "graphql-codegen -c codegen/codegen.ts --watch",
```
