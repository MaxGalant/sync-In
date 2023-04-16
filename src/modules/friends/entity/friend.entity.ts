import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { FriendStatusEnum } from './friend-status.enum';
import { User } from '../../user/entity';

@Entity()
export class Friend {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  friendId: string;

  @ApiProperty()
  @Column({
    type: 'enum',
    nullable: false,
    enum: FriendStatusEnum,
    default: FriendStatusEnum.PENDING,
  })
  status: FriendStatusEnum;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => `CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Kiev'`,
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => `CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Kiev'`,
  })
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.friends)
  user: User;
}
