# PrismaClientをシングルトンで利用する

## ステップ

### PrismaClientをシングルトンで利用するための実装

- シングルトンを利用する処理を追加し、prismaClientはシングルトンで利用する。
- Remixではserver.tsという拡張子を付けることで、サーバーでのみ実行可能なモジュールとして定義できる。

`app/utils/singleton.server.ts`

```ts
export const singleton = <Value>(name: string, valueFactory: () => Value): Value => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const g = global as any;
  g.__singletons ??= {};
  g.__singletons[name] ??= valueFactory();
  return g.__singletons[name];
};
```

`app/lib/prisma.server.ts`

```ts
import { PrismaClient } from '@prisma/client';
import { singleton } from '~/utils/singleton.server';

export const prisma = singleton('prisma', () => new PrismaClient());
```
