import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAuthParams } from 'src/types/auth';
import { Repository } from 'typeorm';
import { Auth } from './auth.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private readonly authRepo: Repository<Auth>,
  ) {}

  async getAuthByUserId(userId: string): Promise<Auth> {
    const auth = await this.authRepo.findOneBy({
      id: userId,
    });
    return auth;
  }

  async createAuth(params: CreateAuthParams): Promise<Auth> {
    const auth = await this.authRepo.save({
      ...params,
    });

    return auth;
  }

  async deleteRefreshToken(refreshToken: string) {
    await this.authRepo.update(
      { refreshToken },
      {
        refreshToken: null,
      },
    );
  }

  async getRefreshToken(refreshToken: string) {
    const auth = await this.authRepo.findOneBy({
      refreshToken,
    });

    return auth?.refreshToken;
  }

  async renewalRefreshToken(id: string, refreshToken: string) {
    await this.authRepo.update(
      {
        id,
      },
      {
        refreshToken,
      },
    );
  }
}
