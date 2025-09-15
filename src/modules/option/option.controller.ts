import {
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { groupBy, mapValues, sortBy } from 'lodash';
import {
  getOptionByProductId,
  makeArrayToSaveOptionToDB,
} from 'src/lib/crawler';
import { normalizeValue } from 'src/lib/function';
import { RequestWithToken } from 'src/types/request';
import { AuthGuard } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service';
import { ProductService } from '../product/product.service';
import { OptionService } from './option.service';

@Controller('option')
export class OptionController {
  constructor(
    private readonly optionService: OptionService,
    private readonly productService: ProductService,
    private readonly authService: AuthService,
  ) {}

  @Post('/crawler')
  @UseGuards(AuthGuard)
  async crawlOptions(
    @Req() req: RequestWithToken,
    @Query('productId', new ParseIntPipe()) productId: string,
  ) {
    const userId = req.user.sub;

    const auth = await this.authService.getAuthByUserId(userId);

    if (!auth || auth.role !== 0) {
      return {
        statusCode: 403,
        message: '권한 없음',
      };
    }

    try {
      const product = await this.productService.getProductById(productId);

      if (product.options.length !== 0) {
        await this.optionService.deleteOptionsByProductId(productId);
      }

      const response = await getOptionByProductId(productId);

      const options = makeArrayToSaveOptionToDB(response, product);

      await this.optionService.saveOptions(options);

      return {
        statusCode: 200,
        message: '옵션 정보 저장 성공',
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
  async getOptions(@Query('productId', new ParseIntPipe()) productId: string) {
    try {
      const optionsResource =
        await this.optionService.getOptionsByProductId(productId);

      const options = mapValues(
        groupBy(optionsResource, (item) => item['name']),
        (group) => sortBy(group, (item) => normalizeValue(item.value)),
      );
      return {
        statusCode: 200,
        message: '옵션 정보 조회 성공',
        body: options,
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
