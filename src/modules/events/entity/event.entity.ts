import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Day } from '../../days/entity/day.entity';

@Entity()
export class Event {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ default: false })
  is_active: boolean;

  @ApiProperty()
  @CreateDateColumn({
    type: 'timestamp',
  })
  started_at: Date;

  @OneToMany(() => Day, (day) => day.event)
  day: Day[];
}
