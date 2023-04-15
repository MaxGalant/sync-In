import { Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Group } from '../entity/group.entity';

export interface IGroupsRepository {
  saveGroup(createData: any, manager: EntityManager): Promise<Group>;
}

@Injectable()
export class GroupsRepository
  extends Repository<Group>
  implements IGroupsRepository
{
  private logger = new Logger('Groups Repository');

  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {
    super(Group, dataSource.createEntityManager());
  }

  async saveGroup(createData: any, manager: EntityManager): Promise<Group> {
    this.logger.log(`Saving group`);

    return manager.save(Group, { ...createData });
  }
}
