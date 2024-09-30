import { GraphQLClient } from 'graphql-request';
import { env } from '~/config/env.server';
import { CookieKeys } from '~/constants/cookie-keys';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const initializeClient = async (request: Request | undefined) => {
  // NOTE: Client生成
  const client = new GraphQLClient(env.API_GQL_URL, {
    fetch: fetch,
  });

  // NOTE: トークンを取得
  const cookieHeader = request?.headers.get('Cookie');
  const cookiesArray = cookieHeader ? cookieHeader.split('; ') : [];
  const authTokenCookie = cookiesArray.find((cookie) =>
    cookie.startsWith(`${CookieKeys.authToken}=`),
  );
  const token = authTokenCookie ? authTokenCookie.split('=')[1] : undefined;

  // NOTE: トークンを設定
  if (token) {
    client.setHeader('Authorization', `Bearer ${token}`);
  } else {
    client.setHeader('Authorization', '');
  }

  return client;
};
