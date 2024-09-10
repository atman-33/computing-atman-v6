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

      const createdPost = await prisma.post.create({
        ...query,
        data: {
          title: input.title,
          emoji: input.emoji,
          content: input.content,
          authorId: ctx.user.id,
        },
      });

      // タグが存在する場合、PostTagを作成
      if (input.tagIds && input.tagIds.length > 0) {
        // tagsの配列からPostTagのデータを作成
        const postTagsData = input.tagIds.map((tagId) => ({
          postId: createdPost.id,
          tagId: tagId,
        }));

        // PostTagを一度に作成
        await prisma.postTag.createMany({
          data: postTagsData,
        });
      }

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
    resolve: async (query, _, { input }) => {
      const { id: rawId } = decodeGlobalID(input.id);
      const updatedPost = await prisma.post.update({
        ...query,
        where: {
          id: rawId,
        },
        data: {
          title: input.title,
          emoji: input.emoji,
          content: input.content,
          published: input.published,
        },
      });

      // タグの更新処理
      if (input.tagIds) {
        // 既存のPostTagを削除
        await prisma.postTag.deleteMany({
          where: {
            postId: rawId,
          },
        });

        // 新しいタグが指定されている場合、新たにPostTagを作成
        if (input.tagIds.length > 0) {
          const postTagsData = input.tagIds.map((tagId) => ({
            postId: rawId,
            tagId: tagId,
          }));

          // PostTagを一度に作成
          await prisma.postTag.createMany({
            data: postTagsData,
          });
        }
      }

      return updatedPost;
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
