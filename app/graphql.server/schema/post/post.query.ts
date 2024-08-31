import { builder } from '~/graphql.server/builder';
import { prisma } from '~/lib/prisma.server';

builder.queryFields((t) => ({
  post: t.prismaField({
    type: 'Post',
    nullable: true,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, _, args) => {
      const { id } = { id: args.id };
      return await prisma.post.findUnique({
        ...query,
        where: { id },
      });
    },
  }),
  posts: t.prismaConnection({
    type: 'Post',
    cursor: 'id',
    resolve: (query) => prisma.post.findMany({ ...query }),
    totalCount: () => prisma.post.count(),
  }),
}));
