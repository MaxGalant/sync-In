import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Friend } from './friend.entity';

@Entity()
export class FriendRequest {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @OneToOne(() => Friend, (friend) => friend.request) // specify inverse side as a second parameter
  @JoinColumn()
  friendCouple: Friend;
}
