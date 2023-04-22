import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Group } from '../../groups/entity';
import { Task } from '../../tasks/entity/task.entity';
import { Day } from '../../days/entity/day.entity';
import { WeekStatusEnum } from './week-status.enum';

@Entity()
export class Week {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({
    type: 'enum',
    nullable: false,
    enum: WeekStatusEnum,
    default: WeekStatusEnum.PENDING,
  })
  status: WeekStatusEnum;

  @CreateDateColumn({
    type: 'timestamp',
  })
  started_at: Date;

  @CreateDateColumn({
    type: 'timestamp',
  })
  finished_at: Date;

  @ManyToOne(() => Group, (group) => group.weeks)
  @JoinTable()
  group: Group;

  @OneToMany(() => Task, (task) => task.week)
  tasks: Task[];

  @OneToMany(() => Day, (day) => day.week)
  days: Day[];
}
