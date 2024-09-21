import { decodeGlobalID } from '@pothos/plugin-relay';
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { useCookies } from '@whatwg-node/server-plugin-cookies';
import { createYoga } from 'graphql-yoga';
import { CookieKeys } from '~/constants/cookie-keys';
import { schema } from '~/lib/server/graphql/schema';
import { prisma } from '~/lib/server/prisma';
import { jwtVerify } from '~/utils/auth-utils';

// NOTE: createYogaで生成したインスタンスはシングルトンとして利用される。
const yoga = createYoga({
  schema, // スキーマとリゾルバーを定義
  graphqlEndpoint: '/api/graphql', // GraphQL のエンドポイントを指定
  context: async (ctx) => {
    const authToken =
      ctx.request.headers.get('Authorization')?.split(' ')?.[1] ||
      (await ctx.request.cookieStore?.get(CookieKeys.authToken))?.value;
    if (!authToken) {
      return { ...ctx };
    }
    const auth = jwtVerify(authToken);
    const { id: rawId } = decodeGlobalID(auth.sub!); // sub: JWTトークンを識別する一意の識別子。ユーザーIDを格納している。
    const user = await prisma.user.findUnique({
      where: { id: rawId },
    });
    return { ...ctx, user };
  },
  // eslint-disable-next-line react-hooks/rules-of-hooks
  plugins: [useCookies()],
});

export async function action({ request, context }: ActionFunctionArgs) {
  const response = await yoga.handleRequest(request, context);
  return new Response(response.body, response);
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  const response = await yoga.handleRequest(request, context);
  return new Response(response.body, response);
}
