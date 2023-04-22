import { Module } from '@nestjs/common';
import { CronsService } from './crons.service';
import { EventsRepository } from '../events/repository/event.repository';

@Module({
  imports: [],
  providers: [CronsService, EventsRepository],
})
export class CronsModule {}
