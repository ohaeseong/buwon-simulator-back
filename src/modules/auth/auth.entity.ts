import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Auth {
  @PrimaryColumn({ type: 'varchar', length: 50, unique: true })
  id: string;

  @Column({ type: 'varchar', nullable: true })
  pw?: string;

  @Column({ type: 'varchar', nullable: true })
  refreshToken: string;

  // 0 = 어드민, 1 = 일반 유저
  @Column({ type: 'int', default: 1 })
  role: number;

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

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id' })
  user: User;
}
