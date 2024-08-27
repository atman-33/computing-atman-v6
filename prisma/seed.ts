import { faker } from '@faker-js/faker';
import { PostStatus, PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

// NOTE: プロジェクト内のファイルをimportするとエラーになるため注意

console.log('🚀 prisma seed start...');

const hashPassword = (rawPassword: string) => {
  const saltRounds = 10;
  return bcrypt.hash(rawPassword, saltRounds);
};

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
