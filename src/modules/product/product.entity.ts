import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Option } from '../option/option.entity';
import { Arrangement } from '../projects/entities/arrangement.entity';

@Entity()
export class Product {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar', length: 250, nullable: true })
  productName?: string;

  @Column({ type: 'varchar', length: 250, nullable: true })
  engProductName?: string;

  @Column({ type: 'varchar', length: 40, nullable: true })
  customProductCode?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  modelName?: string;

  @Column({ type: 'int', nullable: true })
  price?: number;

  @Column({ type: 'int', nullable: true })
  retailPrice?: number;

  @Column({ type: 'varchar', nullable: true })
  display?: string;

  @Column({ type: 'varchar', nullable: true })
  selling?: string;

  @Column({ type: 'int', nullable: true })
  productUsedMonth?: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  summaryDescription?: string;

  @Column({ type: 'varchar', nullable: true })
  listImage?: string;

  @Column({ type: 'int', nullable: true })
  category?: number;

  @Column({ type: 'int', nullable: true })
  parentCategory?: number;

  @OneToMany(() => Option, (option) => option.product)
  options?: Option[];

  @OneToMany(() => Arrangement, (arrangement) => arrangement.product, {
    cascade: true,
    eager: true,
  })
  arrangements?: Arrangement[];
}
