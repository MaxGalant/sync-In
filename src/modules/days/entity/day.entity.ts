import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Task } from '../../tasks/entity/task.entity';
import { Week } from '../../weeks/entity/week.entity';
import { Event } from '../../events/entity/event.entity';

@Entity()
export class Day {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ default: false })
  is_finished: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => `CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Kiev'`,
  })
  started_at: Date;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => `CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Kiev'`,
  })
  finished_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => `CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Kiev'`,
  })
  updated_at: Date;

  @OneToOne(() => Task, (task) => task.day)
  task: Task;

  @OneToOne(() => Event)
  @JoinColumn()
  event: Event;

  @ManyToOne(() => Week, (week) => week.days)
  @JoinTable()
  week: Week;
}
