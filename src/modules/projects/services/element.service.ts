import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateElementDto } from 'src/dtos/project.dto';
import { Repository } from 'typeorm';
import { Element } from '../entities/element.entity';

@Injectable()
export class ElementService {
  constructor(
    @InjectRepository(Element)
    private readonly elementRepo: Repository<Element>,
  ) {}

  async saveElements(elements: CreateElementDto[]): Promise<Array<Element>> {
    const elementEntities: Element[] = [];

    elements.forEach((element) => {
      const elementEntity = new Element();

      elementEntity.elementId = element.elementId;
      elementEntity.type = element.type;
      elementEntity.points = element.points;
      elementEntity.meta = element.meta;
      elementEntity.projectId = element.projectId;
      elementEntities.push(elementEntity);
    });

    return await this.elementRepo.save(elementEntities);
  }

  async deleteElementsByProjectId(projectId: string) {
    await this.elementRepo.delete({
      projectId,
    });
  }

  async getElementsByProjectId(projectId: string): Promise<Element[]> {
    const elements = await this.elementRepo.find({
      where: {
        projectId,
      },
    });

    return elements;
  }
}
