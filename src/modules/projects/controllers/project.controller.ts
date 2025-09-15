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
import {
  CopyProjectDto,
  CreateArrangementsDto,
  CreateElementsDto,
  CreateProjectDto,
} from 'src/dtos/project.dto';
import { RequestWithToken } from 'src/types/request';
import { v4 } from 'uuid';
import { AuthGuard } from '../../auth/auth.guard';
import { AuthService } from '../../auth/auth.service';
import { ArrangementService } from '../services/arrangement.service';
import { ElementService } from '../services/element.service';
import { ProjectService } from '../services/project.service';

@Controller('project')
export class ProjectController {
  constructor(
    private readonly authService: AuthService,
    private readonly projectService: ProjectService,
    private readonly elementService: ElementService,
    private readonly arrangementService: ArrangementService,
  ) {}

  @Post('/')
  @UseGuards(AuthGuard)
  async createProject(
    @Req() req: RequestWithToken,
    @Body() body: CreateProjectDto,
  ) {
    try {
      const userId = req.user.sub;

      const auth = await this.authService.getAuthByUserId(userId);

      if (!auth) {
        return {
          statusCode: 403,
          message: '권한 없음',
        };
      }

      const projects = await this.projectService.getProjectsByUserId(userId);

      // if (projects.length > 5) {
      //   return {
      //     statusCode: 400,
      //     message: '프로젝트 최대 5개 생성 가능',
      //   };
      // }

      const project = {
        title: body.title,
        userId,
      };

      await this.projectService.saveProject(project);

      return {
        statusCode: 200,
        message: '프로젝트 생성 성공',
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
  @UseGuards(AuthGuard)
  async getProjects(
    @Req() req: RequestWithToken,
    @Query('userId') userId: string,
  ) {
    const adminId = req.user.sub;

    try {
      const auth = await this.authService.getAuthByUserId(adminId);

      if (!auth) {
        return {
          statusCode: 403,
          message: '권한 없음',
        };
      }

      const projects = await this.projectService.getProjectsByUserId(userId);

      return {
        statusCode: 200,
        message: '프로젝트 조회 성공',
        body: projects,
      };
    } catch (error) {
      console.log(error);

      return {
        statusCode: 500,
        message: '서버 에러',
      };
    }
  }

  @Get(':projectId')
  @UseGuards(AuthGuard)
  async getProjectDetail(
    @Req() req: RequestWithToken,
    @Param('projectId') projectId: string,
  ) {
    const userId = req.user.sub;

    try {
      const auth = await this.authService.getAuthByUserId(userId);

      if (!auth) {
        return {
          statusCode: 403,
          message: '권한 없음',
        };
      }

      if (!projectId) {
        return {
          statusCode: 400,
          message: '프로젝트 id 없음',
        };
      }

      const project = await this.projectService.getProjectById(projectId);

      if (!project) {
        return {
          statusCode: 404,
          message: '프로젝트 없음',
        };
      }

      return {
        statusCode: 200,
        message: '프로젝트 조회 성공',
        body: project,
      };
    } catch (error) {
      console.log(error);

      return {
        statusCode: 500,
        message: '서버 에러',
      };
    }
  }

  @Put('/')
  @UseGuards(AuthGuard)
  async updateProject(@Req() req: RequestWithToken) {
    const userId = req.user.sub;

    try {
      const auth = await this.authService.getAuthByUserId(userId);

      if (!auth) {
        return {
          statusCode: 403,
          message: '권한 없음',
        };
      }

      return {
        statusCode: 200,
        message: '프로젝트 생성 성공',
      };
    } catch (error) {
      console.log(error);

      return {
        statusCode: 500,
        message: '서버 에러',
      };
    }
  }

  @Post('/copy')
  @UseGuards(AuthGuard)
  async copyProject(
    @Req() req: RequestWithToken,
    @Body() body: CopyProjectDto,
  ) {
    const userId = req.user.sub;

    try {
      const auth = await this.authService.getAuthByUserId(userId);

      if (!auth) {
        return {
          statusCode: 401,
          message: '권한 없음',
        };
      }

      if (auth.role !== 0 && userId !== auth.id) {
        return {
          statusCode: 403,
          message: '권한 없음',
        };
      }

      const project = await this.projectService.getProjectByIdAndUserId(
        body.projectId,
        userId,
      );

      if (!project) {
        return {
          statusCode: 404,
          message: '프로젝트 없음',
        };
      }

      const elements = await this.elementService.getElementsByProjectId(
        body.projectId,
      );

      const newProject = await this.projectService.saveProject({
        title: body.title,
        userId,
      });

      const newElements = elements.map((element) => {
        return {
          ...element,
          elementId: v4(),
          projectId: newProject.projectId,
        };
      });

      await this.elementService.saveElements(newElements);

      return {
        statusCode: 200,
        message: '프로젝트 복사 성공',
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
  async deleteProject(@Req() req: RequestWithToken, @Param('id') id: string) {
    const userId = req.user.sub;

    try {
      const auth = await this.authService.getAuthByUserId(userId);

      if (!auth) {
        return {
          statusCode: 401,
          message: '권한 없음',
        };
      }

      if (!auth) {
        return {
          statusCode: 401,
          message: '권한 없음',
        };
      }

      if (auth.role !== 0 && userId !== auth.id) {
        return {
          statusCode: 403,
          message: '권한 없음',
        };
      }

      await this.projectService.deleteProjectById(id);

      return {
        statusCode: 200,
        message: '프로젝트 삭제 성공',
      };
    } catch (error) {
      console.log(error);

      return {
        statusCode: 500,
        message: '서버 에러',
      };
    }
  }

  @Post('/elements')
  @UseGuards(AuthGuard)
  async createElements(
    @Req() req: RequestWithToken,
    @Body() body: CreateElementsDto,
  ) {
    const userId = req.user.sub;

    try {
      const { projectId } = body;
      const auth = await this.authService.getAuthByUserId(userId);

      if (!auth) {
        return {
          statusCode: 401,
          message: '권한 없음',
        };
      }

      if (auth.role !== 0 && userId !== auth.id) {
        return {
          statusCode: 403,
          message: '권한 없음',
        };
      }

      const project = await this.projectService.getProjectByIdAndUserId(
        projectId,
        userId,
      );

      if (!project) {
        return {
          statusCode: 404,
          message: '프로젝트 없음',
        };
      }

      const { elements } = body;

      await this.elementService.deleteElementsByProjectId(body.projectId);
      await this.elementService.saveElements(elements);
      await this.projectService.updateProjectDate(body.projectId);

      return {
        statusCode: 200,
        message: '엘리먼트 정보 저장 성공',
      };
    } catch (error) {
      console.log(error);

      return {
        statusCode: 500,
        message: '서버 에러',
      };
    }
  }

  @Post('/arrangement')
  @UseGuards(AuthGuard)
  async saveArrangements(
    @Req() req: RequestWithToken,
    @Body() body: CreateArrangementsDto,
  ) {
    const userId = req.user.sub;
    const { arrangements, projectId } = body;

    try {
      const auth = await this.authService.getAuthByUserId(userId);

      if (!auth) {
        return {
          statusCode: 401,
          message: '권한 없음',
        };
      }

      if (auth.role !== 0 && userId !== auth.id) {
        return {
          statusCode: 403,
          message: '권한 없음',
        };
      }

      const project = await this.projectService.getProjectByIdAndUserId(
        projectId,
        userId,
      );

      if (!project) {
        return {
          statusCode: 404,
          message: '프로젝트 없음',
        };
      }

      await this.arrangementService.deleteArrangementsByProjectId(projectId);
      await this.projectService.updateProjectDate(projectId);
      await this.arrangementService.saveArrangements(arrangements);

      return {
        statusCode: 200,
        message: '판매 상품 정보 저장 성공',
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
