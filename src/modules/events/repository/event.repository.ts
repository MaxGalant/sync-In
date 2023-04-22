import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository, UpdateResult } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Event } from '../entity/event.entity';

export interface IEventsRepository {
  saveEvent(createData: any): Promise<Event>;
  updateState(id: string): Promise<UpdateResult>;
  findOneByDateMoreThan(date: Date): Promise<Event>;
  findOneByDateLessThan(date: Date): Promise<Event>;
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

  async updateState(id: string): Promise<UpdateResult> {
    this.logger.log(`Update event stat`);

    return this.update({ id }, { is_active: true });
  }

  async findOneByDateMoreThan(date: Date): Promise<Event> {
    this.logger.log(`Finding event with date`);

    return this.createQueryBuilder('event')
      .where('event.started_at >= :date', { date })
      .getOne();
  }

  async findOneByDateLessThan(date: Date): Promise<Event> {
    this.logger.log(`Finding event with date`);

    return this.createQueryBuilder('event')
      .where('event.started_at <= :date', { date })
      .andWhere('event.is_active=false')
      .getOne();
  }
}
