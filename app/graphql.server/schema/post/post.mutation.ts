import { decodeGlobalID } from '@pothos/plugin-relay';
import { builder } from '~/graphql.server/builder';
import { prisma } from '~/lib/prisma.server';
import { CreatePostInput } from './dto/input/create-post-args.dto';
import { UpdatePostInput } from './dto/input/update-post-args.dto';

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

      const createdPost = prisma.post.create({
        ...query,
        data: {
          title: input.title,
          content: input.content,
          authorId: ctx.user.id,
        },
      });

      return createdPost;
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
    resolve: async (query, _, { input }, ctx) => {
      if (!ctx.user) {
        throw new Error('required ctx.user');
      }

      const { id: rawId } = decodeGlobalID(input.id);
      const updatedPost = prisma.post.update({
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

      return updatedPost;
    },
  }),
}));
