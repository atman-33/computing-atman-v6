import { json } from '@remix-run/node';
import { isRouteErrorResponse, useLoaderData, useRouteError } from '@remix-run/react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/shadcn/ui/table';
import { graphql } from '~/lib/gql/@generated';
import { initializeClient } from '~/lib/server/graphql-client';
import { createErrorResponse } from '~/utils/create-error-response';

const getTagsGql = graphql(`
  query getTags {
    tags {
      id
      image
      name
    }
  }
`);

export const loader = async () => {
  const client = await initializeClient(undefined);
  return await client
    .request(getTagsGql)
    .then(({ tags }) => {
      return json(tags);
    })
    .catch((error) => {
      // エラーレスポンスをthrowする場合
      throw createErrorResponse(error);
    });
};

const GraphqlQueryTestPage = () => {
  const tags = useLoaderData<typeof loader>();
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return <div>Error: {error.data || 'Unknown error'}</div>;
  }

  return (
    <>
      <Table>
        <TableCaption>A list of tags.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tags?.map((tag) => (
            <TableRow key={tag.id}>
              <TableCell>{tag.id}</TableCell>
              <TableCell>
                {tag.image ? (
                  <img src={tag.image} alt={tag.name ?? undefined} style={{ width: '50px' }} />
                ) : (
                  'No Image'
                )}
              </TableCell>
              <TableCell>{tag.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default GraphqlQueryTestPage;
