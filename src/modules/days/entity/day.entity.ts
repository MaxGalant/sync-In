import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Task } from '../../tasks/entity/task.entity';
import { Week } from '../../weeks/entity';
import { Event } from '../../events/entity/event.entity';
import { Media } from '../../media/entity/media.entity';

@Entity()
export class Day {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ default: false })
  is_finished: boolean;

  @ApiProperty()
  @Column()
  number: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => `CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Kiev'`,
  })
  started_at: Date;

  @CreateDateColumn({
    type: 'timestamp',
  })
  finished_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => `CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Kiev'`,
  })
  updated_at: Date;

  @OneToOne(() => Task, (task) => task.day)
  task: Task;

  @OneToMany(() => Media, (media) => media.user)
  media: Media[];

  @OneToOne(() => Event)
  @JoinColumn()
  event: Event;

  @ManyToOne(() => Week, (week) => week.days)
  @JoinTable()
  week: Week;
}
