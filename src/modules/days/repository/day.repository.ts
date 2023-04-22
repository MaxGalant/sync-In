import { Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Day } from '../entity/day.entity';

export interface IDaysRepository {
  saveDay(createData: any, manager: EntityManager): Promise<Day>;
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
    this.logger.log(`Saving days`);

    return manager.save(Day, { ...createData });
  }
}
