import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

import { CreateUserDto } from 'src/dtos/user.dto';
import { COOKIE_AGES } from 'src/lib/auth';
import { RequestWithToken } from 'src/types/request';
import { CustomResponse } from 'src/types/response';
import { AuthGuard } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  @Get('/me')
  @UseGuards(AuthGuard)
  async getMyProfile(
    @Req() req: RequestWithToken,
  ): Promise<CustomResponse<User & { role: number }>> {
    const userId = req.user.sub;
    const user = await this.userService.getUserById({ userId });
    const auth = await this.authService.getAuthByUserId(userId);

    if (!user) {
      return {
        statusCode: 404,
        message: '유저 정보없음',
      };
    }

    return {
      statusCode: 200,
      message: '유저 정보 조회 완료',
      body: { ...user, role: auth.role },
    };
  }

  @Post('/register')
  async createUser(
    @Res({ passthrough: true }) res: Response,
    @Body() createUserDto: CreateUserDto,
  ): Promise<CustomResponse<User>> {
    const { id } = createUserDto;
    const userById = await this.userService.getUserById({ userId: id });

    if (userById) {
      return {
        statusCode: 403,
        message: '이미 가입된 유저',
      };
    }

    const newUser = await this.userService.createUser(createUserDto);

    const payload = { sub: newUser.id, username: newUser.name };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.APP_JWT_SECRET,
      expiresIn: '15m',
    });
    const refreshToken = await this.jwtService.signAsync(
      { sub: payload.sub },
      {
        secret: process.env.APP_JWT_SECRET,
        expiresIn: '30d',
      },
    );

    await this.authService.createAuth({
      id: newUser.id,
      refreshToken,
    });

    res.cookie('bw_access_token', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: COOKIE_AGES.FIFTEEN_MINUTES_IN_MS,
    });

    res.cookie('bw_refresh_token', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: COOKIE_AGES.THIRTY_DAYS,
    });

    return {
      statusCode: 200,
      message: '유저 정보 저장 완료',
      body: { ...newUser },
    };
  }
}
