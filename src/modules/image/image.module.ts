import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from '../auth/auth.entity';
import { AuthService } from '../auth/auth.service';
import { ImageController } from './image.controller';
import { Image } from './image.entity';
import { ImageService } from './image.service';

@Module({
  imports: [TypeOrmModule.forFeature([Image, Auth])],
  controllers: [ImageController],
  providers: [ImageService, AuthService],
})
export class ImageModule {}
