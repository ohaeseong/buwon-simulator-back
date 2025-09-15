import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateProjectDto } from 'src/dtos/project.dto';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
  ) {}

  async getProjectById(projectId: string): Promise<Project> {
    const project = await this.projectRepo.findOne({
      where: {
        projectId,
      },
      relations: ['elements', 'arrangements'],
    });

    return project;
  }

  async getProjectByIdAndUserId(
    projectId: string,
    userId: string,
  ): Promise<Project> {
    const project = await this.projectRepo.findOne({
      where: {
        projectId,
        userId,
      },
    });

    return project;
  }

  async updateProjectDate(projectId: string) {
    await this.projectRepo.update(
      { projectId },
      {
        updatedAt: new Date(),
      },
    );
  }

  async getProjectsByUserId(userId: string): Promise<Project[]> {
    const projects = await this.projectRepo.find({
      where: {
        userId,
      },
    });

    return projects;
  }

  async saveProject(
    params: CreateProjectDto & { userId: string },
  ): Promise<Project> {
    const project = await this.projectRepo.save({
      ...params,
    });

    return project;
  }

  async deleteProjectById(projectId) {
    await this.projectRepo.delete({
      projectId,
    });
  }
}
