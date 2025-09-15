import { Product } from 'src/modules/product/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Project } from './project.entity';

@Entity()
export class Arrangement {
  constructor() {
    this.points = [];
  }

  @PrimaryColumn({ type: 'varchar', unique: true })
  id: string;

  @Column('float')
  angle: number;

  @Column('json')
  points: number[];

  @Column('json', { nullable: true })
  option?: Record<string, any>;

  @Column({ type: 'varchar' })
  productId: string;

  @CreateDateColumn({
    type: 'timestamp',
    precision: 6,
  })
  createdAt: Date;

  @ManyToOne(() => Product, (product) => product.arrangements, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: 'varchar' })
  projectId: string;

  @ManyToOne(() => Project, (project) => project.elements, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'projectId' })
  project: Project;
}
