import { IsNotEmpty } from 'class-validator';

export class UpdateProductActivateStatusDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  display: string;
}

export class DeleteProductDto {
  @IsNotEmpty()
  id: string;
}
