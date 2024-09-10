import { decodeGlobalID } from '@pothos/plugin-relay';
import { builder } from '~/graphql.server/builder';
import { prisma } from '~/lib/prisma.server';
import { CreateTagInput } from './dto/input/create-tag-input.dto';
import { DeleteTagInput } from './dto/input/delete-tag-input.dto';
import { UpdateTagInput } from './dto/input/update-tag-input.dto';

builder.mutationFields((t) => ({
  /**
   * createTag
   */
  createTag: t.prismaField({
    type: 'Tag',
    nullable: false,
    args: {
      input: t.arg({
        type: CreateTagInput,
        required: true,
      }),
    },
    authScopes: { admin: true },
    resolve: async (query, _, { input }) => {
      return await prisma.tag.create({
        data: {
          name: input.name,
          image: input.image ?? undefined,
        },
      });
    },
  }),
  /**
   * updateTag
   */
  updateTag: t.prismaField({
    type: 'Tag',
    nullable: true,
    args: {
      input: t.arg({
        type: UpdateTagInput,
        required: true,
      }),
    },
    authScopes: { admin: true },
    resolve: async (query, _, { input }) => {
      const { id: rawId } = decodeGlobalID(input.id);
      return await prisma.tag.update({
        ...query,
        where: { id: rawId },
        data: {
          name: input.name,
          image: input.image ?? undefined,
        },
      });
    },
  }),
  /**
   * deleteTag
   */
  deleteTag: t.prismaField({
    type: 'Tag',
    nullable: true,
    args: {
      input: t.arg({
        type: DeleteTagInput,
        required: true,
      }),
    },
    authScopes: { admin: true },
    resolve: async (query, _, { input }) => {
      const { id: rawId } = decodeGlobalID(input.id);
      return await prisma.tag.delete({
        ...query,
        where: { id: rawId },
      });
    },
  }),
}));
