import { json } from '@remix-run/node';
import { SuccessResponse } from '~/types/server-response';

export const createSuccessResponseJson = <T>(data: T) => {
  if (data) {
    return json<SuccessResponse<T>>({
      success: true,
      data,
    });
  }
};
