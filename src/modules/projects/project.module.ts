import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from '../auth/auth.entity';
import { AuthService } from '../auth/auth.service';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { ProjectController } from './controllers/project.controller';
import { Arrangement } from './entities/arrangement.entity';
import { Element } from './entities/element.entity';
import { Project } from './entities/project.entity';
import { ArrangementService } from './services/arrangement.service';
import { ElementService } from './services/element.service';
import { ProjectService } from './services/project.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, User, Auth, Element, Arrangement]),
  ],
  controllers: [ProjectController],
  providers: [
    ProjectService,
    ElementService,
    UserService,
    AuthService,
    ArrangementService,
  ],
})
export class ProjectModule {}
