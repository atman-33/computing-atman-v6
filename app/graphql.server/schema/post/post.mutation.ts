import { builder } from '~/graphql.server/builder';
import { prisma } from '~/lib/prisma.server';
import { CreatePostInput } from './dto/input/create-post-args.dto';

builder.mutationFields((t) => ({
  createPost: t.prismaField({
    type: 'Post',
    nullable: false,
    args: {
      input: t.arg({
        type: CreatePostInput,
        required: true,
      }),
    },
    authScopes: {
      loggedIn: true,
    },
    resolve: async (query, _, { input }, ctx) => {
      if (!ctx.user) {
        throw new Error('required ctx.user');
      }

      const createdPost = prisma.post.create({
        data: {
          title: input.title,
          content: input.content,
          authorId: ctx.user.id,
        },
      });

      return createdPost;
    },
  }),
}));
