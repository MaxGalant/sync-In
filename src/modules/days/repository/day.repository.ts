import { Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityManager, Repository, UpdateResult } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Day } from '../entity/day.entity';

export interface IDaysRepository {
  saveDay(createData: any, manager: EntityManager): Promise<Day>;
  saveDays(createData: any[]): Promise<Day[]>;
  updateDays(ids: string[], updateData: any): Promise<UpdateResult>;
  findManyByDayAndIfEventNull(day: number): Promise<Day[]>;
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
  updateDays(ids: string[], updateData: any): Promise<UpdateResult> {
    this.logger.log(`Update days `);

    return this.update(ids, updateData);
  }

  async findManyByDayAndIfEventNull(day: number): Promise<Day[]> {
    this.logger.log(`Finding days where day:${day} and event- null`);

    return this.find({ where: { number: day, event: null } });
  }
}
