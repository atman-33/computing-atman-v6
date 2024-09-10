import { decodeGlobalID } from '@pothos/plugin-relay';
import { builder } from '~/libs/server/graphql/builder';
import { prisma } from '~/libs/server/prisma';
import { GetPostArgs } from './dto/args/get-post-args.dto';

builder.queryFields((t) => ({
  /**
   * post
   */
  post: t.prismaField({
    type: 'Post',
    nullable: true,
    args: {
      args: t.arg({
        type: GetPostArgs,
        required: true,
      }),
    },
    resolve: async (query, _, { args }) => {
      const { id: rawId } = decodeGlobalID(args.id);
      return await prisma.post.findUnique({
        ...query,
        where: { id: rawId },
      });
    },
  }),
  /**
   * posts
   */
  posts: t.prismaConnection({
    type: 'Post',
    cursor: 'id',
    resolve: (query) => prisma.post.findMany({ ...query }),
    totalCount: () => prisma.post.count(),
  }),
}));
