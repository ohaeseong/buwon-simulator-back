import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UpdateProductActivateStatusDto } from 'src/dtos/product.dto';
import {
  getProductsByCategory,
  makeArrayToSaveProductToDB,
} from 'src/lib/crawler';
import { generateArray } from 'src/lib/function';
import { RequestWithToken } from 'src/types/request';
import { AuthGuard } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service';
import { CategoryService } from '../category/category.service';
import { Product } from './product.entity';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly authService: AuthService,
  ) {}

  @Post('/crawler')
  @UseGuards(AuthGuard)
  async crawlProducts(@Req() req: RequestWithToken) {
    const userId = req.user.sub;

    const auth = await this.authService.getAuthByUserId(userId);

    if (!auth || auth.role !== 0) {
      return {
        statusCode: 403,
        message: '권한 없음',
      };
    }

    try {
      await this.productService.deleteAllProducts();

      const categories = await this.categoryService.getCategories();

      const products: Array<Product> = [];

      await Promise.all(
        categories.map(async (category) => {
          const limitArray = generateArray(category.productCount);

          await Promise.all(
            limitArray.map(async (_, index) => {
              const offset = limitArray[index];
              const limit = limitArray[index + 1];

              if (offset !== undefined && limit !== undefined) {
                const response = await getProductsByCategory(
                  category.id,
                  offset,
                  100,
                );
                const newProducts = response.map((product) => {
                  return {
                    ...product,
                    category: category.id,
                    parentCategory: category.parentCategoryId,
                  };
                });
                products.push(...newProducts);
              }
            }),
          );
        }),
      );

      const newProducts = makeArrayToSaveProductToDB(products);

      if (newProducts.length <= 0) {
        return {
          statusCode: 404,
          message: '제품 정보를 찾지 못했습니다.',
        };
      }

      await this.productService.saveProducts(newProducts);

      return {
        statusCode: 200,
        message: '제품 정보 저장 성공',
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
  async getProductsByCategory(
    @Query('category') category: number,
    @Query('page') page?: number,
  ) {
    try {
      if (!page) {
        const allProducts =
          await this.productService.getAllProductsByCategory(category);

        return {
          statusCode: 200,
          message: '제품 조회 성공',
          body: { products: allProducts },
        };
      }

      const products = await this.productService.getProductsByCategory(
        category,
        page,
      );

      const allProducts =
        await this.productService.getAllProductsByCategory(category);

      const totalPage = Math.ceil(allProducts.length / 6);

      return {
        statusCode: 200,
        message: '제품 조회 성공',
        body: { products, totalPage },
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
    @Body() updateActivateDto: UpdateProductActivateStatusDto,
  ) {
    const userId = req.user.sub;
    const { id, display } = updateActivateDto;

    try {
      const auth = await this.authService.getAuthByUserId(userId);

      if (!auth || auth.role !== 0) {
        return {
          statusCode: 403,
          message: '권한 없음',
        };
      }

      const product = await this.productService.getProductById(id);

      if (!product) {
        return {
          statusCode: 404,
          message: '카테고리 정보 없음',
        };
      }

      await this.productService.setActivate(id, display);

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

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteCategory(@Param('id') id: string, @Req() req: RequestWithToken) {
    const userId = req.user.sub;

    try {
      const auth = await this.authService.getAuthByUserId(userId);

      if (!auth || auth.role !== 0) {
        return {
          statusCode: 403,
          message: '권한 없음',
        };
      }

      await this.productService.deleteProductById(id);

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
}
