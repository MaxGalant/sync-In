import { Injectable, Logger } from '@nestjs/common';
import {
  DataSource,
  EntityManager,
  Equal,
  Not,
  Repository,
  UpdateResult,
} from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Day } from '../entity/day.entity';

export interface IDaysRepository {
  saveDay(createData: any, manager: EntityManager): Promise<Day>;
  saveDays(createData: any[]): Promise<Day[]>;
  updateDays(ids: string[], updateData: any): Promise<UpdateResult>;
  updateDaysWithFilter(eventId: string): Promise<UpdateResult>;
  findManyByDayAndIfEventNull(day: number): Promise<Day[]>;
  findOneDay(id: string): Promise<Day>;
}

@Injectable()
export class DaysRepository extends Repository<Day> implements IDaysRepository {
  private logger = new Logger('Task Repository');

  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {
    super(Day, dataSource.createEntityManager());
  }

  async saveDay(createData: any, manager: EntityManager): Promise<Day> {
    this.logger.log(`Saving day`);

    return manager.save(Day, { ...createData });
  }

  async saveDays(createData: any[]): Promise<Day[]> {
    this.logger.log(`Saving days`);

    return this.save(createData);
  }
  async updateDays(ids: string[], updateData: any): Promise<UpdateResult> {
    this.logger.log(`Update days `);

    return this.update(ids, updateData);
  }

  async updateDaysWithFilter(eventId: string): Promise<UpdateResult> {
    this.logger.log(`Update days state`);
    console.log(eventId);
    return this.update(
      { is_finished: false, event: { id: Not(Equal(eventId)) } },
      { is_finished: true },
    );
  }

  async findManyByDayAndIfEventNull(day: number): Promise<Day[]> {
    this.logger.log(`Finding days where day:${day} and event- null`);

    return this.createQueryBuilder('day')
      .where('day.number = :day', { day })
      .andWhere('day.event IS NULL OR day.event = :null', { null: null })
      .getMany();
  }

  async findOneDay(id: string): Promise<Day> {
    this.logger.log(`Finding day`);

    return this.findOne({ where: { id } });
  }
}
