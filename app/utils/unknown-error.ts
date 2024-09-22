import { json } from '@remix-run/node';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const unknownError = (error: any | undefined) => {
  json(
    {
      errorType: 'UnknownError',
      error: error ?? 'An unknown error occurred.',
    },
    {
      status: 500,
    },
  );
};
