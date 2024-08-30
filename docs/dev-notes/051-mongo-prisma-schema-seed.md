# MongoDB、Prisma（schema, seed）セットアップ

## 参考URL

- [PrismaとPothosでコード生成を使いながら効率よくGraphQLサーバーを作ってみる](https://zenn.dev/poyochan/articles/9f22799853784d)

## ステップ

### 開発用DB（MongoDB）構築

`tools/database-local/setup-docker-mongo-single-replica.md`を参考にMongoDBを構築する。  

### Prismaセットアップ

```sh
npm i -D prisma
npx prisma init
```

`prisma/schema.prisma`

```s
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

enum Role {
  MEMBER
  ADMIN
}

enum PostStatus {
  DRAFT
  PUBLIC
}

model User {
  id    String @id @default(auto()) @map("_id") @db.ObjectId
  email String @unique
  name  String
  role  Role   @default(MEMBER)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  password Password?
  posts    Post[]
}

model Password {
  id     String @id @default(auto()) @map("_id") @db.ObjectId
  userId String @unique @db.ObjectId
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)

  hashed String

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id      String     @id @default(auto()) @map("_id") @db.ObjectId
  title   String
  content String
  status  PostStatus @default(DRAFT)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  authorId String @db.ObjectId
  author   User   @relation(fields: [authorId], references: [id], onDelete: Cascade, onUpdate: Cascade)
}
```

- Prisma Client を生成する。  

```sh
npx prisma generate
```

### Seedデータを格納

- ダミーデータ生成のために、Fakerをインストールする。

```sh
npm i -D @faker-js/faker
```

- パスワード暗号化のために、bcyptをインストールする。

```sh
npm i bcrypt @types/bcrypt
```

- seedファイルを作成する。

`prisma/seed.ts`

```ts
import { faker } from '@faker-js/faker';
import { PostStatus, PrismaClient } from '@prisma/client';
import { hashPassword } from '~/utils/password-utils';

console.log('🚀 prisma seed start...');

const prisma = new PrismaClient();

const main = async () => {
  const users = Array.from({ length: 10 }).map((/*_, i*/) => ({
    // id: (i + 1).toString(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
  }));

  const posts = Array.from({ length: 30 }).map((/*_, i*/) => ({
    // id: i + 1,
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraph(),
    status: Math.floor(Math.random() * 10) % 4 === 0 ? 'DRAFT' : 'PUBLIC',
    // authorId: Math.floor(Math.random() * 10) + 1,
  }));

  const hashedPassword = await hashPassword('password');

  await prisma.user.deleteMany();
  await Promise.all(
    users.map((user) =>
      prisma.user.create({
        data: {
          email: user.email,
          name: user.name,
          password: {
            create: {
              hashed: hashedPassword,
            },
          },
        },
      }),
    ),
  );

  const createdUsers = await prisma.user.findMany();

  await prisma.post.deleteMany();
  await Promise.all(
    posts.map((post) =>
      prisma.post.create({
        data: {
          title: post.title,
          content: post.content,
          status: post.status as PostStatus,
          authorId: createdUsers[Math.floor(Math.random() * 10)].id,
        },
      }),
    ),
  );
};

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('🌙 prisma seed end...');
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
```

- tsxをインストール

```sh
npm i -D tsx
```

- seed（データ生成）を実行する。

```sh
npx tsx prisma/seed.ts
```
