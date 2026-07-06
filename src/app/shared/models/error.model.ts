export interface ApiErrorModel {
  success?: boolean;
  statusCode?: number;
  message?: string;
  data?: unknown;
  errors?: Record<string, string> | string[] | string | null;
  status?: number;
}
