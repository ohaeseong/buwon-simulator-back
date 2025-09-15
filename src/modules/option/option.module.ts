import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from '../auth/auth.entity';
import { AuthService } from '../auth/auth.service';
import { Product } from '../product/product.entity';
import { ProductService } from '../product/product.service';
import { OptionController } from './option.controller';
import { Option } from './option.entity';
import { OptionService } from './option.service';

@Module({
  imports: [TypeOrmModule.forFeature([Option, Product, Auth])],
  controllers: [OptionController],
  providers: [OptionService, ProductService, AuthService],
})
export class OptionModule {}
