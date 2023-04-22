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
import { Day } from '../../days/entity/day.entity';
import { Week } from '../../weeks/entity/week.entity';

@Entity()
export class Task {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  text: string;

  @ApiProperty()
  @Column({ default: false })
  is_finished: boolean;

  @ApiProperty()
  @Column()
  created_by: string;

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

  @ManyToOne(() => Week, (week) => week.tasks)
  @JoinTable()
  week: Week;

  @OneToOne(() => Day)
  @JoinColumn()
  day: Day;
}
