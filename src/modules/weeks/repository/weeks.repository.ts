import { Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Week } from '../entity/week.entity';

export interface IWeeksRepository {
  saveWeek(createData: any, manager: EntityManager): Promise<Week>;
}

@Injectable()
export class WeeksRepository
  extends Repository<Week>
  implements IWeeksRepository
{
  private logger = new Logger('Task Repository');

  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {
    super(Week, dataSource.createEntityManager());
  }

  async saveWeek(createData: any, manager: EntityManager): Promise<Week> {
    this.logger.log(`Saving weeks`);

    return manager.save(Week, { ...createData });
  }
}
