import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Option } from './option.entity';

@Injectable()
export class OptionService {
  constructor(
    @InjectRepository(Option)
    private readonly optionRepo: Repository<Option>,
  ) {}

  async saveOptions(options: Option[]): Promise<Array<Option>> {
    const optionEntities: Option[] = [];

    options.forEach((option) => {
      const optionEntity = new Option();

      optionEntity.productId = option.productId;
      optionEntity.name = option.name;
      optionEntity.required = option.required;
      optionEntity.value = option.value;
      optionEntities.push(optionEntity);
    });

    return await this.optionRepo.save(optionEntities);
  }

  async getOptionsByProductId(productId: string): Promise<Array<Option>> {
    const options = await this.optionRepo.find({
      where: {
        productId,
      },
    });
    return options;
  }

  async deleteOptionsByProductId(productId: string) {
    await this.optionRepo.delete({
      productId,
    });
  }
}
