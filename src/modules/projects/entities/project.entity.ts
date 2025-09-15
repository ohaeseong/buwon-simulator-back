import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Arrangement } from './arrangement.entity';
import { Element } from './element.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  projectId: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  userId: string;

  @Column({ type: 'varchar', nullable: true })
  thumbnail: string;

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

  @OneToMany(() => Element, (element) => element.project, {
    cascade: true,
    eager: true,
  })
  elements: Element[];

  @OneToMany(() => Arrangement, (arrangement) => arrangement.project, {
    cascade: true,
    eager: true,
  })
  arrangements: Arrangement[];
}
