import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Between, Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async saveCategories(categories: Category[]) {
    const categoryEntities: Category[] = [];

    categories.forEach((category) => {
      const categoryEntity = new Category();
      categoryEntity.id = category.id;
      categoryEntity.name = category.name;
      categoryEntity.parentCategoryId = category.parentCategoryId;
      categoryEntity.categoryDepth = category.categoryDepth;
      categoryEntity.rootCategoryId = category.rootCategoryId;
      categoryEntity.displayOrder = category.displayOrder;
      categoryEntity.productCount = category.productCount;
      categoryEntity.useDisplay = category.useDisplay;
      categoryEntities.push(categoryEntity);
    });

    return await this.categoryRepo.save(categoryEntities);
  }

  async saveCategory(category: Category) {
    await this.categoryRepo.save(category);
  }

  async deleteAllCategories() {
    await this.categoryRepo.delete({});
  }

  async getTodayCreatedCategory(depth: number): Promise<Category> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const category = await this.categoryRepo.find({
      where: {
        updatedAt: Between(today, tomorrow),
        categoryDepth: depth,
      },
    });

    return category[0];
  }

  async getCategories(useDisplay?: 'T' | 'F'): Promise<Array<Category>> {
    if (!!useDisplay) {
      return await this.categoryRepo.find({
        where: {
          useDisplay,
        },
      });
    } else {
      return await this.categoryRepo.find();
    }
  }

  async getCategoriesByDepth(
    depth: number,
    parentCategory?: number,
    useDisplay?: 'T' | 'F' | undefined,
  ): Promise<Array<Category>> {
    const categories = await this.categoryRepo.find({
      where: {
        categoryDepth: depth,
        parentCategoryId: parentCategory || null,
        useDisplay: !useDisplay ? 'T' : useDisplay,
      },

      order: { displayOrder: 'ASC' },
    });

    return categories;
  }

  async getCategoryById(id: number): Promise<Array<Category>> {
    const category = await this.categoryRepo.find({
      where: {
        id,
      },
    });

    return category;
  }

  async deleteCategoryById(id: number) {
    await this.categoryRepo.delete({
      id,
    });
  }

  async setActivate(id: number, display: string) {
    await this.categoryRepo.update(
      { id },
      {
        useDisplay: display,
      },
    );
  }
}
