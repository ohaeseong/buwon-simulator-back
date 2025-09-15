import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateArrangementDto } from 'src/dtos/project.dto';
import { Repository } from 'typeorm';
import { Arrangement } from '../entities/arrangement.entity';

@Injectable()
export class ArrangementService {
  constructor(
    @InjectRepository(Arrangement)
    private readonly arrangementRepo: Repository<Arrangement>,
  ) {}

  async saveArrangements(
    arrangements: CreateArrangementDto[],
  ): Promise<Array<Arrangement>> {
    const arrangementEntities: Arrangement[] = [];

    arrangements.forEach((arrangement) => {
      const arrangementEntity = new Arrangement();

      arrangementEntity.id = arrangement.id;
      arrangementEntity.angle = arrangement.angle;
      arrangementEntity.points = arrangement.points;
      arrangementEntity.option = arrangement.option;
      arrangementEntity.productId = arrangement.productId;
      arrangementEntity.projectId = arrangement.projectId;
      arrangementEntities.push(arrangementEntity);
    });

    return await this.arrangementRepo.save(arrangementEntities);
  }

  async deleteArrangementsByProjectId(projectId: string) {
    await this.arrangementRepo.delete({
      projectId,
    });
  }
}
