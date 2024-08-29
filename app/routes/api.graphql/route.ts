import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { createYoga } from 'graphql-yoga';
import { schema } from '~/graphql.server/schema';

// Define your schema and resolvers
// const typeDefs = /* GraphQL */ `
//   type Query {
//     hello: String
//   }
// `;

// const resolvers = {
//   Query: {
//     hello: () => 'Hello from Yoga!',
//   },
// };

// const schema = createSchema({
//   typeDefs,
//   resolvers,
// });

const yoga = createYoga({
  schema,
  graphqlEndpoint: '/api/graphql', // GraphQL のエンドポイントを指定
});

export async function action({ request, context }: ActionFunctionArgs) {
  const response = await yoga.handleRequest(request, context);
  return new Response(response.body, response);
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  const response = await yoga.handleRequest(request, context);
  return new Response(response.body, response);
}
