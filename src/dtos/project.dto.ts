import { Optional } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  title: string;
}

export class CopyProjectDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  projectId: string;
}

export class CreateElementDto {
  @IsNotEmpty()
  elementId: string;

  @IsNotEmpty()
  projectId: string;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  points: number[];

  @IsOptional()
  meta?: any;
}

export class CreateElementsDto {
  @IsNotEmpty()
  projectId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateElementDto)
  elements: CreateElementDto[];
}

export class CreateArrangementDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  angle: number;

  @IsNotEmpty()
  points: number[];

  @Optional()
  option: Record<string, any>;

  @IsNotEmpty()
  projectId: string;

  @IsNotEmpty()
  productId: string;
}

export class CreateArrangementsDto {
  @IsNotEmpty()
  projectId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateArrangementDto)
  arrangements: CreateArrangementDto[];
}
