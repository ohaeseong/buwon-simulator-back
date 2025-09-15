import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Category {
  @PrimaryColumn({ type: 'int' })
  id: number;

  @Column({ type: 'int' })
  parentCategoryId: number;

  @Column({ type: 'int' })
  rootCategoryId: number;

  @Column({ type: 'int' })
  categoryDepth: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'int' })
  displayOrder: number;

  @Column({ type: 'varchar', length: 10 })
  useDisplay: string;

  @Column({ type: 'int', default: null, nullable: true })
  productCount?: number;

  @CreateDateColumn({
    type: 'timestamp',
    precision: 6,
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    precision: 6,
  })
  updatedAt: Date;
}
