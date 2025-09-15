import { CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Image {
  @PrimaryColumn({ type: 'int' })
  id: number;

  @CreateDateColumn({
    type: 'timestamp',
    precision: 6,
  })
  createdAt: Date;
}
