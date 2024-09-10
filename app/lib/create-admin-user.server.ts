import { hashPassword } from '~/utils/auth-utils';
import { prisma } from './prisma.server';

export const createAdminUser = async () => {
  const admin = await prisma.user.findUnique({
    where: {
      email: 'admin@example.com',
    },
  });

  if (!admin) {
    const hashedPassword = await hashPassword('admin');
    await prisma.user.create({
      data: {
        name: 'admin',
        email: 'admin@example.com',
        role: 'ADMIN',
        password: {
          create: {
            hashed: hashedPassword,
          },
        },
      },
    });
    console.log('admin user created!');
  }
};
