export interface ResponseWithCode {
  message?: string;
  error?: string;
  statusCode: number;
}

export interface CustomResponse<T> {
  statusCode: number;
  message: string;
  body?: T;
}
