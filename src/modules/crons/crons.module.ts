import { Module } from '@nestjs/common';
import { CronsService } from './crons.service';
import { EventsRepository } from '../events/repository/event.repository';
import { WeeksRepository } from '../weeks/repository/weeks.repository';
import { DaysRepository } from '../days/repository/day.repository';

@Module({
  imports: [],
  providers: [CronsService, EventsRepository, WeeksRepository, DaysRepository],
})
export class CronsModule {}
