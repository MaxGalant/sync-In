import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Event } from '../entity/event.entity';

export interface IEventsRepository {
  saveEvent(createData: any): Promise<Event>;
  findOneByDate(date: Date): Promise<Event>;
}

@Injectable()
export class EventsRepository
  extends Repository<Event>
  implements IEventsRepository
{
  private logger = new Logger('Task Repository');

  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {
    super(Event, dataSource.createEntityManager());
  }
  async saveEvent(createData: any): Promise<Event> {
    this.logger.log(`Saving events`);

    return this.save({ ...createData });
  }

  async findOneByDate(date: Date): Promise<Event> {
    this.logger.log(`Finding event with date`);

    return this.createQueryBuilder('event')
      .where('event.started_at >= :date', { date })
      .getOne();
  }
}
