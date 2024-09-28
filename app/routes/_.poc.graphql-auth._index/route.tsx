import { ActionFunctionArgs } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '~/components/shadcn/ui/alert';
import { Button } from '~/components/shadcn/ui/button';
import { Input } from '~/components/shadcn/ui/input';
import { graphql } from '~/lib/gql/@generated';
import { initializeClient } from '~/lib/server/graphql-client';
import { createSuccessResponseJson } from '~/utils/creata-success-response-json';
import { createErrorResponseJson } from '~/utils/create-error-response-json';

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
      // if (!login) {
      //   throw new Error('login が null となっています!');
      // }

      console.log(`token: ${login?.token}`);

      // トークンを保存する処理を追加
      // 例: saveToken(login.token);
      // return redirect('/dashboard'); // 成功時のリダイレクト先
      return createSuccessResponseJson({
        token: login?.token,
      });
    })
    .catch((error) => {
      return createErrorResponseJson(error, { email, password });
    });
};

const GraphqlAuthTestPage = () => {
  const data = useActionData<typeof action>();
  const [errorMessage, setErrorMessage] = useState('');

  // 入力データの状態を管理
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (data && !data.success) {
      console.log(data);
      setErrorMessage(data.error ?? '');

      // TODO: この処理ではなく、useFetcherを利用する方がよいはず
      setEmail(data.data?.email ?? '');
      setPassword(data.data?.password ?? '');
    }
  }, [data]);

  const handleEmailChange = (value: string) => {
    setEmail(value);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
  };

  return (
    <>
      <Form method="post" className="flex w-1/2 flex-col gap-4">
        <Input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => handleEmailChange(e.target.value)}
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => handlePasswordChange(e.target.value)}
        />
        <Button type="submit">Login</Button>
        {errorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
      </Form>
    </>
  );
};

export default GraphqlAuthTestPage;
