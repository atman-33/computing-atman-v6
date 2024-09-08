import { decodeGlobalID } from '@pothos/plugin-relay';
import { builder } from '~/graphql.server/builder';
import { prisma } from '~/lib/prisma.server';
import { CreatePostInput } from './dto/input/create-post-input.dto';
import { DeletePostInput } from './dto/input/delete-post-input.dto';
import { UpdatePostInput } from './dto/input/update-post-input.dto';

builder.mutationFields((t) => ({
  /**
   * createPost
   */
  createPost: t.prismaField({
    type: 'Post',
    nullable: false,
    args: {
      input: t.arg({
        type: CreatePostInput,
        required: true,
      }),
    },
    authScopes: { loggedIn: true },
    resolve: async (query, _, { input }, ctx) => {
      if (!ctx.user) {
        throw new Error('required ctx.user');
      }

      return prisma.post.create({
        ...query,
        data: {
          title: input.title,
          content: input.content,
          authorId: ctx.user.id,
        },
      });
    },
  }),

  /**
   * updatePost
   */
  updatePost: t.prismaField({
    type: 'Post',
    nullable: true,
    args: {
      input: t.arg({
        type: UpdatePostInput,
        required: true,
      }),
    },
    authScopes: { loggedIn: true },
    resolve: async (query, _, { input }) => {
      const { id: rawId } = decodeGlobalID(input.id);
      return prisma.post.update({
        ...query,
        where: {
          id: rawId,
        },
        data: {
          title: input.title,
          content: input.content,
          status: input.status,
        },
      });
    },
  }),
  /**
   * deletePost
   */
  deletePost: t.prismaField({
    type: 'Post',
    nullable: true,
    args: {
      input: t.arg({
        type: DeletePostInput,
        required: true,
      }),
    },
    authScopes: { loggedIn: true },
    resolve: async (query, _, { input }) => {
      const { id: rawId } = decodeGlobalID(input.id);
      return await prisma.post.delete({
        ...query,
        where: { id: rawId },
      });
    },
  }),
}));
