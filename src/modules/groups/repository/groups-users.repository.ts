import { Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityManager, Repository, UpdateResult } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { GroupUser, GroupUserStatusEnum } from '../entity';

export interface IGroupsUsersRepository {
  saveGroupUser(
    users: GroupUser[],
    manager: EntityManager,
  ): Promise<GroupUser[]>;

  findManyPendingByUserId(userId: string): Promise<GroupUser[]>;
  findOnePendingByUserId(id: string, userId: string): Promise<GroupUser>;
  findOnePendingByUserId(id: string, userId: string): Promise<GroupUser>;
  updateStatus(
    id: string,
    status: GroupUserStatusEnum,
    manager: EntityManager,
  ): Promise<UpdateResult>;
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
  async findManyPendingByUserId(userId: string): Promise<GroupUser[]> {
    this.logger.log(`Finding group's user in pending status`);

    return this.find({
      where: { user: { id: userId }, status: GroupUserStatusEnum.PENDING },
    });
  }
  async findOnePendingByUserId(id: string, userId: string): Promise<GroupUser> {
    this.logger.log(`Finding group user in pending status`);

    return this.findOne({
      where: { id, user: { id: userId }, status: GroupUserStatusEnum.PENDING },
    });
  }
  async updateStatus(
    id: string,
    status: GroupUserStatusEnum,
    manager: EntityManager,
  ): Promise<UpdateResult> {
    this.logger.log(`Updating group user status`);

    return manager.update(GroupUser, { id }, { status });
  }
}
