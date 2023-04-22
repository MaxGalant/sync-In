import { Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityManager, Repository, UpdateResult } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Week } from '../entity';
import { WeekStatusEnum } from '../entity';

export interface IWeeksRepository {
  saveWeek(createData: any, manager: EntityManager): Promise<Week>;
  findManyInPendingStatus(): Promise<Week[]>;
  updateStatus(id: string, status: WeekStatusEnum): Promise<UpdateResult>;
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

  async findManyInPendingStatus(): Promise<Week[]> {
    this.logger.log(`Find weeks with pending status`);

    return this.find({
      where: { status: WeekStatusEnum.PENDING },
      relations: ['tasks'],
    });
  }

  async updateStatus(
    id: string,
    status: WeekStatusEnum,
  ): Promise<UpdateResult> {
    this.logger.log(`Update week's status`);

    return this.update({ id }, { status });
  }
}
