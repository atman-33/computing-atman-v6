import { ClientError } from 'graphql-request';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createErrorResponse = (error: any) => {
  if (error instanceof ClientError) {
    const status = error.response.status || 500;
    let message = 'An unknown error occurred.';
    const errors = error.response.errors;
    if (errors) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      message = (errors[0].extensions as any).originalError.message;
    }

    return new Response(message, {
      status,
    });
  }

  return new Response('An unknown error occurred.', {
    status: 500,
  });
};
