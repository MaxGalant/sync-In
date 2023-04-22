import {
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Day } from '../../days/entity/day.entity';

@Entity()
export class Event {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    type: 'timestamp',
  })
  started_at: Date;

  @OneToOne(() => Day, (day) => day.event)
  day: Day;
}
