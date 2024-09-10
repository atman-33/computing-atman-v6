# GraphQL codegen セットアップ

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
