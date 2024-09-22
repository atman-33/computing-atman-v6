import { ActionFunctionArgs } from '@remix-run/node';
import { isRouteErrorResponse, useRouteError } from '@remix-run/react';
import { useEffect } from 'react';
import { Button } from '~/components/shadcn/ui/button';
import { Input } from '~/components/shadcn/ui/input';
import { graphql } from '~/lib/gql/@generated';
import { initializeClient } from '~/lib/server/graphql-client';
import { createErrorResponse } from '~/utils/create-error-response';

const loginGql = graphql(`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`);

export const action = async ({ request }: ActionFunctionArgs) => {
  const client = await initializeClient(undefined);
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  return await client
    .request(loginGql, { email, password })
    .then(({ login }) => {
      console.log(`token: ${login?.token}`);

      // トークンを保存する処理を追加
      // 例: saveToken(login.token);
      // return redirect('/dashboard'); // 成功時のリダイレクト先
    })
    .catch((error) => {
      throw createErrorResponse(error);
    });
};

const GraphqlAuthTestPage = () => {
  // const data = useActionData<typeof action>();
  const error = useRouteError();

  useEffect(() => {
    if (isRouteErrorResponse(error)) {
      console.log(error);
    }
  }, [error]);

  return (
    <form method="post" className="flex flex-col gap-4">
      <Input type="email" name="email" placeholder="Email" required />
      <Input type="password" name="password" placeholder="Password" required />
      <Button type="submit">Login</Button>
    </form>
  );
};

export default GraphqlAuthTestPage;
