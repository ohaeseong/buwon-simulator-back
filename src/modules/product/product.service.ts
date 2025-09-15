import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async getProductById(productId: string) {
    const product = await this.productRepo.findOne({
      where: {
        id: productId,
      },
      relations: ['options'],
    });
    return product;
  }

  async getProductsByCategory(
    category: number,
    page?: number,
  ): Promise<Array<Product>> {
    const products = await this.productRepo.find({
      where: {
        category,
        display: 'T',
      },
      take: 6,
      skip: (page - 1) * 6,
    });
    return products;
  }

  async getAllProductsByCategory(category: number): Promise<Array<Product>> {
    const products = await this.productRepo.find({
      where: {
        category,
      },
    });
    return products;
  }

  async deleteAllProducts() {
    await this.productRepo.delete({});
  }

  async saveProducts(products: Product[]) {
    const productEntities: Product[] = [];

    products.forEach((product) => {
      const productEntity = new Product();

      productEntity.id = product.id;
      productEntity.productName = product.productName;
      productEntity.engProductName = product.engProductName;
      productEntity.customProductCode = product.customProductCode;
      productEntity.modelName = product.modelName;
      productEntity.price = product.price;
      productEntity.retailPrice = product.retailPrice;
      productEntity.display = product.display;
      productEntity.selling = product.selling;
      productEntity.productUsedMonth = product.productUsedMonth;
      productEntity.summaryDescription = product.summaryDescription;
      productEntity.listImage = product.listImage;
      productEntity.category = product.category;
      productEntity.parentCategory = product.parentCategory;
      productEntities.push(productEntity);
    });

    return await this.productRepo.save(productEntities);
  }

  async setActivate(id: string, display: string) {
    await this.productRepo.update(
      { id },
      {
        display,
      },
    );
  }

  async deleteProductById(id: string) {
    await this.productRepo.delete({ id });
  }
}
