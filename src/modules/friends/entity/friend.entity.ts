import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { FriendStatusEnum } from './friend-status.enum';
import { FriendRequest } from './friend-request.entity';

@Entity()
export class Friend {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  userId: string;

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

  @OneToOne(() => FriendRequest, (request) => request.friendCouple) // specify inverse side as a second parameter
  request: FriendRequest;
}
