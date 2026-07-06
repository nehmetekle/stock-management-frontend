export interface CommonResponseModel<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  errors: Record<string, string> | string[] | string | null;
}
