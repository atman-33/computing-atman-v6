export type SuccessResponse<T = unknown> = {
  success: true;
  data: T; // 成功時のデータ型
};

export type ErrorResponse<T = unknown> = {
  success: false;
  error: string; // エラーメッセージやエラー情報
  status?: number;
  data?: T;
};

export type ServerResponse = SuccessResponse | ErrorResponse;
