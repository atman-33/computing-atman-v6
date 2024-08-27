import { PrismaClient } from '@prisma/client';
import { singleton } from '~/utils/singleton.server';

export const prisma = singleton('prisma', () => new PrismaClient());
