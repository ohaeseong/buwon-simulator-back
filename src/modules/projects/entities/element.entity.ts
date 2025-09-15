import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Project } from './project.entity';

@Entity()
export class Element {
  constructor() {
    this.points = [];
  }

  @PrimaryColumn({ type: 'varchar', unique: true })
  elementId: string;

  @Column({
    type: 'enum',
    enum: ['wall', 'door', 'rectangularColumn', 'roundColumn'],
  })
  type: string;

  @Column('json')
  points: number[];

  @Column('json', { nullable: true })
  meta?: Record<string, any>;

  @Column({ type: 'varchar' })
  projectId: string;

  @ManyToOne(() => Project, (project) => project.elements, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'projectId' })
  project: Project;
}
