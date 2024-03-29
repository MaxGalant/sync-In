import { Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Group, GroupUserStatusEnum } from '../entity';

export interface IGroupsRepository {
  saveGroup(createData: any, manager: EntityManager): Promise<Group>;
  findOneByIdAndOwnerId(id: string, ownerId: string): Promise<Group>;
  findManyAcceptedByUserId(userId: string): Promise<Group[]>;
  findOneAcceptedByIdAndUserId(id: string, userId: string): Promise<Group>;
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

  async findOneByIdAndOwnerId(id: string, ownerId: string): Promise<Group> {
    this.logger.log(
      `Finding group with id:${id} and where owner with id:${ownerId}`,
    );

    return this.findOne({
      where: { id, ownerId },
      relations: ['users', 'users.user'],
    });
  }
  async findManyAcceptedByUserId(userId: string): Promise<Group[]> {
    this.logger.log(`Finding groups where user with id:${userId}`);

    return this.find({
      where: {
        users: { user: { id: userId }, status: GroupUserStatusEnum.ACCEPTED },
      },
    });
  }
  async findOneAcceptedByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<Group> {
    this.logger.log(`Finding group where id:${id} user with id:${userId}`);

    const currentDate = new Date();

    currentDate.setDate(currentDate.getDate() - currentDate.getDay());

    return this.createQueryBuilder('group')
      .leftJoinAndSelect('group.weeks', 'week', 'week.started_at>=:date', {
        date: currentDate,
      })
      .leftJoinAndSelect('week.tasks', 'task')
      .leftJoinAndSelect('week.days', 'day', "day.is_finished='true'")
      .leftJoinAndSelect('day.media', 'media')
      .leftJoinAndSelect('media.user', 'user')
      .where('group.id = :id', { id })
      .getOne();
  }
}
