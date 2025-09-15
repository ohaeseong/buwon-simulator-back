import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { TokenPayload } from 'src/types/auth';

export class LoginDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  pw: string;
}

export class RefreshTokenDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  refreshToken: string;
}

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(15)
  name: string;

  @IsEmail()
  @IsString()
  email?: string;

  @IsString()
  profileImage?: string;

  @IsString()
  lineId?: string;

  @IsString()
  kakaoId?: string;

  user: TokenPayload;
}

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(16)
  id: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(15)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  // @IsString()
  // address?: string;

  @IsString()
  nomalPhone?: string;

  @IsNotEmpty()
  @MinLength(11)
  @MaxLength(11)
  @IsString()
  phone: string;
}
