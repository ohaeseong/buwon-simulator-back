export interface CreateAuthParams {
  id: string;
  refreshToken: string;
}

export interface TokenPayload {
  sub: string;
  iat: number;
  exp: number;
}
