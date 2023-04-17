import { Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { GroupUser } from '../entity';

export interface IGroupsUsersRepository {
  saveGroupUser(
    users: GroupUser[],
    manager: EntityManager,
  ): Promise<GroupUser[]>;
}

@Injectable()
export class GroupsUsersRepository
  extends Repository<GroupUser>
  implements IGroupsUsersRepository
{
  private logger = new Logger('Groups Repository');

  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {
    super(GroupUser, dataSource.createEntityManager());
  }

  async saveGroupUser(
    users: GroupUser[],
    manager: EntityManager,
  ): Promise<GroupUser[]> {
    this.logger.log(`Saving group's user`);

    return manager.save(GroupUser, users);
  }
}
