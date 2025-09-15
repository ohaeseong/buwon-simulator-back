import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { LoginDto } from 'src/dtos/user.dto';
import { COOKIE_AGES } from 'src/lib/auth';
import { RequestWithToken } from 'src/types/request';
import { UserService } from '../user/user.service';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('/callback')
  async callbackCode(@Req() req: Request, @Res() res: Response) {
    const baseURL = process.env.FRONT_HOST_ADDRESS;

    try {
      const code = req.url.split('=')[1].split('&')[0];

      const credentials = btoa(
        `${process.env.CAFE_CLIENT_ID}:${process.env.CAFE_SECRET}`,
      );

      if (!code) {
        return {
          statusCode: 401,
          url: baseURL,
        };
      }
      const response = await fetch(process.env.BUWN_AUTH_URL, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          redirect_uri: process.env.FRONT_HOST_ADDRESS,
          code,
        }).toString(),
      });

      if (!response.ok) {
        return {
          statusCode: 403,
          url: baseURL,
        };
      }

      const data = await response.json();

      if (!data?.user_id) {
        return {
          statusCode: 404,
          url: baseURL,
        };
      }

      const userId = data.user_id;

      const userById = await this.userService.getUserById({ userId });

      if (userById) {
        const payload = { sub: userById.id, username: userById.name };
        const accessToken = await this.jwtService.signAsync(
          { sub: payload.sub },
          {
            secret: process.env.APP_JWT_SECRET,
            expiresIn: '15m',
          },
        );
        const refreshToken = await this.jwtService.signAsync(
          { sub: payload.sub },
          {
            secret: process.env.APP_JWT_SECRET,
            expiresIn: '30d',
          },
        );

        await this.authService.renewalRefreshToken(userId, refreshToken);

        res.cookie('bw_refresh_token', refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          maxAge: COOKIE_AGES.THIRTY_DAYS,
        });

        res.redirect(baseURL + `/callback?access_token=${accessToken}`);
      } else {
        res.redirect(baseURL + `/register?user_id=${userId}`);
      }
    } catch (error) {
      console.log(error);

      return {
        statusCode: 500,
        url: baseURL,
      };
    }
  }

  @Get('/user-list')
  @UseGuards(AuthGuard)
  async getUserList(@Req() req: RequestWithToken) {
    const userId = req.user.sub;
    try {
      const auth = await this.authService.getAuthByUserId(userId);

      if (auth.role !== 0) {
        return {
          statusCode: 403,
          message: '권한 없음',
        };
      }

      const users = await this.userService.getAllUsers();

      return {
        statusCode: 200,
        message: '조회 성공',
        body: users,
      };
    } catch (error) {
      console.log(error);

      return {
        statusCode: 500,
        message: '서버에러 발생',
      };
    }
  }

  @Delete('/:userId')
  @UseGuards(AuthGuard)
  async deleteUser(
    @Req() req: RequestWithToken,
    @Param('userId') userId: string,
  ) {
    const adminId = req.user.sub;
    try {
      const auth = await this.authService.getAuthByUserId(adminId);

      if (auth.role !== 0) {
        return {
          statusCode: 403,
          message: '권한 없음',
        };
      }

      await this.userService.deleteUserById({
        userId,
      });

      return {
        statusCode: 200,
        message: '삭제 성공',
      };
    } catch (error) {
      console.log(error);

      return {
        statusCode: 500,
        message: '서버에러 발생',
      };
    }
  }

  @Post('/login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { id, pw } = body;

    try {
      const auth = await this.authService.getAuthByUserId(id);

      if (auth?.pw.length === 0 || auth.role !== 0) {
        return {
          statusCode: 403,
          message: '권한 없음',
        };
      }

      const isMatch = await bcrypt.compare(pw, auth.pw);

      if (!isMatch) {
        return {
          statusCode: 401,
          message: '로그인 실패',
        };
      }

      const user = await this.userService.getUserById({ userId: id });

      const payload = { sub: id, username: user.name };
      const accessToken = await this.jwtService.signAsync(
        { sub: payload.sub },
        {
          secret: process.env.APP_JWT_SECRET,
          expiresIn: '15m',
        },
      );
      const refreshToken = await this.jwtService.signAsync(
        { sub: payload.sub },
        {
          secret: process.env.APP_JWT_SECRET,
          expiresIn: '30d',
        },
      );

      res.cookie('bw_refresh_token', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: COOKIE_AGES.THIRTY_DAYS,
      });

      return {
        statusCode: 200,
        message: '로그인 성공',
        body: { accessToken, user },
      };
    } catch (error) {
      console.log(error);

      return {
        statusCode: 500,
        message: '로그인 실패',
      };
    }
  }

  @Post('/logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies.bw_refresh_token;

    try {
      await this.authService.deleteRefreshToken(refreshToken);

      res.cookie('bw_refresh_token', '', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: COOKIE_AGES.ZERO,
      });

      return {
        statusCode: 200,
        message: '로그아웃 성공',
      };
    } catch (error) {
      console.log(error);

      return {
        statusCode: 500,
        message: '로그아웃 실패',
      };
    }
  }

  @Post('/refresh')
  async refreshToken(@Req() req: RequestWithToken) {
    const refreshToken = req.cookies.bw_refresh_token;

    if (!refreshToken) {
      return {
        statusCode: 400,
        message: '토큰 발급 실패 (토큰 없음)',
      };
    }

    try {
      const oldRefreshToken =
        await this.authService.getRefreshToken(refreshToken);

      if (!oldRefreshToken) {
        return {
          statusCode: 401,
          message: '토큰 발급 실패 (유효하지 않은 토큰)',
        };
      }

      const payload = await this.jwtService.verifyAsync(oldRefreshToken, {
        secret: process.env.APP_JWT_SECRET,
      });

      const accessToken = await this.jwtService.signAsync(
        { sub: payload.sub },
        {
          secret: process.env.APP_JWT_SECRET,
          expiresIn: '15m',
        },
      );

      return {
        statusCode: 200,
        message: '토큰 재발급 완료',
        body: {
          accessToken,
        },
      };
    } catch (error) {
      console.log(error);
      if (error.name === 'TokenExpiredError') {
        return {
          statusCode: 419,
          message: '토큰 만료',
        };
      }

      return {
        statusCode: 500,
        message: '로그인 실패',
      };
    }
  }

  @Post('/add/admin')
  async registerAdmin(@Body() body: LoginDto) {
    const { id, pw } = body;

    try {
      const hashedPw = await bcrypt.hash(pw, 10);
      const payload = { sub: id, username: '오해성' };
      const token = await this.jwtService.signAsync(payload, {
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

      return {
        statusCode: 200,
        message: '비밀번호 해시 성공',
        body: { id, hashedPw, token, refreshToken },
      };
    } catch (error) {
      console.log(error);

      return {
        statusCode: 500,
        message: '로그인 실패',
      };
    }
  }
}
