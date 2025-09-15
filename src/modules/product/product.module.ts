import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from '../auth/auth.entity';
import { AuthService } from '../auth/auth.service';
import { Category } from '../category/category.entity';
import { CategoryService } from '../category/category.service';
import { ProductController } from './product.controller';
import { Product } from './product.entity';
import { ProductService } from './product.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, Auth])],
  controllers: [ProductController],
  providers: [ProductService, CategoryService, AuthService],
})
export class ProductModule {}
