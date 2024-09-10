import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '~/utils/auth-utils';

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
    emoji: faker.string.alphanumeric({ length: 1 }),
    content: faker.lorem.paragraph(),
    published: Math.floor(Math.random() * 10) % 4 === 0 ? false : true,
    // authorId: Math.floor(Math.random() * 10) + 1,
  }));

  const tags = Array.from({ length: 20 }).map(() => ({
    name: faker.word.noun(),
    image: faker.image.url(), // fakerを使って画像URLを生成
  }));

  const hashedPassword = await hashPassword('password');

  // データ削除
  await prisma.user.deleteMany();
  await prisma.post.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.postTag.deleteMany();

  // Userデータ生成
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

  // Postデータ生成
  await Promise.all(
    posts.map((post) =>
      prisma.post.create({
        data: {
          title: post.title,
          emoji: post.emoji,
          content: post.content,
          published: post.published,
          authorId: createdUsers[Math.floor(Math.random() * 10)].id,
        },
      }),
    ),
  );

  // 生成したPostを取得
  const createdPosts = await prisma.post.findMany();

  // Tagデータ生成
  await Promise.all(
    tags.map((tag) =>
      prisma.tag.create({
        data: {
          name: tag.name,
          image: tag.image,
        },
      }),
    ),
  );
  const createdTags = await prisma.tag.findMany();

  // PostTagのデータ生成
  const postTags = Array.from({ length: 50 }).map(() => ({
    postId: createdPosts[Math.floor(Math.random() * createdPosts.length)].id,
    tagId: createdTags[Math.floor(Math.random() * createdTags.length)].id,
  }));

  await Promise.all(
    postTags.map((postTag) =>
      prisma.postTag.create({
        data: {
          postId: postTag.postId,
          tagId: postTag.tagId,
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
