import { Injectable, Logger } from '@nestjs/common';
import { Cron, Timeout } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EventsRepository,
  IEventsRepository,
} from '../events/repository/event.repository';

@Injectable()
export class CronsService {
  private readonly logger = new Logger('Crons Service');

  constructor(
    @InjectRepository(EventsRepository)
    private readonly eventsRepository: IEventsRepository,
  ) {}

  @Cron('* * * * * *')
  @Timeout(0)
  async handleCron() {
    const date = new Date();

    const event = await this.eventsRepository.findOneByDate(date);

    if (!event) {
      date.setHours(date.getHours() + 3);

      const saveEventData = { started_at: date };

      await this.eventsRepository.saveEvent(saveEventData);
    }
  }
}
