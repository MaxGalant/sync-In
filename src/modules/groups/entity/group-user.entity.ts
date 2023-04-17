import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entity';
import { GroupUserStatusEnum } from './group-user-status.enum';
import { Group } from './group.entity';

@Entity()
export class GroupUser {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: string;

  @ApiProperty()
  @Column({
    type: 'enum',
    nullable: false,
    enum: GroupUserStatusEnum,
    default: GroupUserStatusEnum.PENDING,
  })
  status: GroupUserStatusEnum;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Group)
  group: Group;

  constructor(user: User, group: Group, status?: GroupUserStatusEnum) {
    this.user = user;
    this.group = group;
    this.status = status;
  }
}
