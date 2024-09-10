import { decodeGlobalID } from '@pothos/plugin-relay';
import { builder } from '~/graphql.server/builder';
import { prisma } from '~/lib/prisma.server';
import { GetTagArgs } from './dto/args/get-tag-args.dto';

builder.queryFields((t) => ({
  /**
   * tag
   */
  tag: t.prismaField({
    type: 'Tag',
    nullable: true,
    args: {
      args: t.arg({
        type: GetTagArgs,
        required: true,
      }),
    },
    resolve: async (query, _, { args }) => {
      const { id: rawId } = decodeGlobalID(args.id);
      return await prisma.tag.findUnique({
        ...query,
        where: { id: rawId },
      });
    },
  }),
  /**
   * tags
   */
  tags: t.prismaField({
    type: ['Tag'],
    nullable: true,
    resolve: async (query) => await prisma.tag.findMany({ ...query }),
  }),
}));
