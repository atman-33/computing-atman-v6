import { json } from '@remix-run/node';
import { ClientError } from 'graphql-request';
import { ErrorResponse } from '~/types/server-response';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createErrorResponseJson = <T>(error: any, data?: T) => {
  let status = 500;
  let message = 'An unknown error occurred.';
  if (error instanceof ClientError) {
    const errors = error.response.errors;
    status = error.response.status;

    if (errors) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      message = (errors[0].extensions as any).originalError.message;
    }
  }

  if (data) {
    return json<ErrorResponse<T>>({
      success: false,
      error: message,
      status,
      data,
    });
  }
};
