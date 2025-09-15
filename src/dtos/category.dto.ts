import { IsNotEmpty, IsOptional } from 'class-validator';

export class GetCategoriesDto {
  @IsNotEmpty()
  depth: number;

  @IsOptional()
  parentCategory?: number;
}

export class DeleteCategoryDto {
  @IsNotEmpty()
  id: number;
}

export class UpdateCategoryActivateStatusDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  useDisplay: string;
}

export class CreateActivateStatusDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  displayOrder: number;

  @IsOptional()
  productCount?: string;

  @IsNotEmpty()
  parentCategoryId: number;

  @IsNotEmpty()
  rootCategory: number;

  @IsNotEmpty()
  useDisplay: string;

  @IsNotEmpty()
  categoryDepth: string;
}
