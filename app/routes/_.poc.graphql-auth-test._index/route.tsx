import { ActionFunctionArgs, json } from '@remix-run/node';
import { useActionData } from '@remix-run/react';
import { ClientError } from 'graphql-request';
import { useEffect } from 'react';
import { Button } from '~/components/shadcn/ui/button';
import { Input } from '~/components/shadcn/ui/input';
import { graphql } from '~/lib/gql/@generated';
import { initializeClient } from '~/lib/server/graphql-client';
import { unknownError } from '~/utils/unknown-error';

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
      if (error instanceof ClientError) {
        return json(
          {
            errorType: 'ClientError',
            error: error,
          },
          {
            status: 400,
          },
        );
      }
      return unknownError(error);
    });
};

const GraphqlAuthTestPage = () => {
  const data = useActionData<typeof action>();

  useEffect(() => {
    if (data?.errorType) {
      console.log(data);
      console.log(data.error.response.errors?.at(0));
    }
  }, [data]);

  return (
    <form method="post" className="flex flex-col gap-4">
      <Input type="email" name="email" placeholder="Email" required />
      <Input type="password" name="password" placeholder="Password" required />
      <Button type="submit">Login</Button>
    </form>
  );
};

export default GraphqlAuthTestPage;
