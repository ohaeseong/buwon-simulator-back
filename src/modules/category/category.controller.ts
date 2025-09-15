import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  DeleteCategoryDto,
  GetCategoriesDto,
  UpdateCategoryActivateStatusDto,
} from 'src/dtos/category.dto';
import {
  getCategoriesByParentCategory,
  getProductCountByCategory,
  makeArrayToSaveCategoryToDB,
} from 'src/lib/crawler';
import { RequestWithToken } from 'src/types/request';
import { CustomResponse } from 'src/types/response';
import { AuthGuard } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service';
import { Category } from './category.entity';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly authService: AuthService,
  ) {}

  @Post('/crawler')
  @UseGuards(AuthGuard)
  async crawlCategories(@Req() req: RequestWithToken) {
    const userId = req.user.sub;

    try {
      const auth = await this.authService.getAuthByUserId(userId);

      if (!auth || auth.role !== 0) {
        return {
          statusCode: 403,
          message: '권한 없음',
        };
      }

      const savedCategories = [];
      const latestCategory =
        await this.categoryService.getTodayCreatedCategory(2);

      if (latestCategory !== undefined) {
        return {
          statusCode: 403,
          message: '이미 API 제한 횟수를 넘겼습니다. (하루 1회)',
        };
      }

      const response = await getCategoriesByParentCategory(1);

      const rootCategories = makeArrayToSaveCategoryToDB(response);

      await this.categoryService.saveCategories(rootCategories);

      const parentCategories =
        await this.categoryService.getCategoriesByDepth(1);

      if (parentCategories.length === 0) {
        return {
          statusCode: 422,
          message: '상위 카테고리 정보 없음.',
        };
      }

      await Promise.all(
        parentCategories.map(async (category) => {
          const response = await getCategoriesByParentCategory(category.id);
          if (response.length > 0) {
            const categories = makeArrayToSaveCategoryToDB(response);

            savedCategories.push(...categories);
          }
        }),
      );

      savedCategories.map(async (category: Category) => {
        const categoryId = category.id;

        const productCount = await getProductCountByCategory(categoryId);

        const newCategory = {
          ...category,
          productCount,
        };

        await this.categoryService.saveCategory(newCategory);
      });

      return {
        statusCode: 200,
        message: '카테고리 정보 저장 성공',
      };
    } catch (error) {
      console.log(error);

      return {
        statusCode: 500,
        message: '서버 에러',
      };
    }
  }

  @Get('/all')
  async getAllCategories(
    @Query('useDisplay') useDisplay?: 'T' | 'F',
  ): Promise<CustomResponse<Category[]>> {
    try {
      const categories = await this.categoryService.getCategories(useDisplay);

      return {
        statusCode: 200,
        message: '카테고리 정보 조회 성공',
        body: categories,
      };
    } catch (error) {
      console.log(error);

      return {
        statusCode: 500,
        message: '서버 에러',
      };
    }
  }

  @Get('/')
  async getCategoriesWithDepth(
    @Query() query: GetCategoriesDto,
  ): Promise<CustomResponse<Category[]>> {
    const { depth, parentCategory } = query;

    try {
      const categories = await this.categoryService.getCategoriesByDepth(
        depth,
        parentCategory,
      );

      return {
        statusCode: 200,
        message: '카테고리 정보 조회 성공',
        body: categories,
      };
    } catch (error) {
      console.log(error);

      return {
        statusCode: 500,
        message: '서버 에러',
      };
    }
  }

  @Delete('/')
  @UseGuards(AuthGuard)
  async deleteCategory(
    @Query() query: DeleteCategoryDto,
    @Req() req: RequestWithToken,
  ) {
    const userId = req.user.sub;
    const { id } = query;

    try {
      const auth = await this.authService.getAuthByUserId(userId);

      if (!auth || auth.role !== 0) {
        return {
          statusCode: 403,
          message: '권한 없음',
        };
      }

      await this.categoryService.deleteCategoryById(id);

      return {
        statusCode: 200,
        message: '카테고리 정보 삭제 성공',
      };
    } catch (error) {
      console.log(error);

      return {
        statusCode: 500,
        message: '서버 에러',
      };
    }
  }

  @Put('/activate')
  @UseGuards(AuthGuard)
  async updateActivateStatus(
    @Req() req: RequestWithToken,
    @Body() updateActivateDto: UpdateCategoryActivateStatusDto,
  ) {
    const userId = req.user.sub;
    const { id, useDisplay } = updateActivateDto;

    try {
      const auth = await this.authService.getAuthByUserId(userId);

      if (!auth || auth.role !== 0) {
        return {
          statusCode: 403,
          message: '권한 없음',
        };
      }

      const category = await this.categoryService.getCategoryById(id);

      if (!category) {
        return {
          statusCode: 404,
          message: '카테고리 정보 없음',
        };
      }

      await this.categoryService.setActivate(id, useDisplay);

      return {
        statusCode: 200,
        message: '카테고리 (비)활성화 업데이트 성공',
      };
    } catch (error) {
      console.log(error);

      return {
        statusCode: 500,
        message: '서버 에러',
      };
    }
  }
}
