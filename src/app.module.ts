import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './modules/auth/auth.entity';
import { AuthModule } from './modules/auth/auth.module';
import { Category } from './modules/category/category.entity';
import { CategoryModule } from './modules/category/category.module';
import { Image } from './modules/image/image.entity';
import { ImageModule } from './modules/image/image.module';
import { Option } from './modules/option/option.entity';
import { OptionModule } from './modules/option/option.module';
import { Product } from './modules/product/product.entity';
import { ProductModule } from './modules/product/product.module';
import { Arrangement } from './modules/projects/entities/arrangement.entity';
import { Element } from './modules/projects/entities/element.entity';
import { Project } from './modules/projects/entities/project.entity';
import { ProjectModule } from './modules/projects/project.module';
import { User } from './modules/user/user.entity';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PW,
      database: process.env.DB_NAME,
      entities: [
        User,
        Auth,
        Product,
        Category,
        Option,
        Project,
        Element,
        Image,
        Arrangement,
      ],
      synchronize: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.APP_JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    ProjectModule,
    OptionModule,
    CategoryModule,
    ProductModule,
    UserModule,
    AuthModule,
    ImageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
