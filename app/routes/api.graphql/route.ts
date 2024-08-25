import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { createSchema, createYoga } from 'graphql-yoga';

// Define your schema and resolvers
const typeDefs = /* GraphQL */ `
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello from Yoga!',
  },
};

const schema = createSchema({
  typeDefs,
  resolvers,
});

const yoga = createYoga({
  schema,
  graphqlEndpoint: '/api/graphql', // GraphQL のエンドポイントを指定
});

export async function action({ request, context }: ActionFunctionArgs) {
  const response = await yoga.handleRequest(request);
  return new Response(response.body, response);
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  const response = await yoga.handleRequest(request);
  return new Response(response.body, response);
}
