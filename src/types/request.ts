import { Request } from 'express';
import { TokenPayload } from 'src/types/auth';

export interface RequestWithToken extends Request {
  user: TokenPayload;
}
