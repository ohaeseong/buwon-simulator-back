import { Controller, Post, Req } from '@nestjs/common';
import * as path from 'path';
import { RequestWithToken } from 'src/types/request';

@Controller('image')
export class ImageController {
  constructor() {}

  @Post('/upload')
  // @UseGuards(AuthGuard)
  async upload(@Req() req: RequestWithToken) {
    try {
      const uploadPath = path.join(process.cwd(), 'upload', 'cad');

      const response = await fetch(process.env.ROBOFLOW_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: process.env.ROBOFLOW_API_KEY,
          inputs: {
            image: { type: 'url', value: 'IMAGE_URL' },
          },
        }),
      });

      const result = await response.json();

      return {
        statusCode: 200,
        message: '이미지 정보 저장 성공',
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
