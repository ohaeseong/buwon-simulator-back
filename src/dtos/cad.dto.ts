import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCadDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  contents: string;

  @IsNotEmpty()
  @IsNumber()
  locationX: number;

  @IsNotEmpty()
  @IsNumber()
  locationY: number;

  @IsNotEmpty()
  @IsString()
  nation: string;
}

export class UpdateCadDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  id: string;

  @IsString()
  @MinLength(1)
  @MaxLength(50)
  title?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  contents?: string;
}

export class DeleteCadDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  id: string;
}
