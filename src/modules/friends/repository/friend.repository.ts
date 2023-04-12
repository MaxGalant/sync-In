import { Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityManager, Repository, UpdateResult } from 'typeorm';
import { Friend, FriendStatusEnum } from '../entity';
import { InjectDataSource } from '@nestjs/typeorm';

export interface IFriendRepository {
  findOneByUserIdAndFriendId(userId: string, friendId: string): Promise<Friend>;

  isUserBlocked(userId: string, friendId: string): Promise<boolean>;

  saveFriend(
    userId: string,
    friendId: string,
    manager: EntityManager,
  ): Promise<Friend>;

  updateStatus(
    id: string,
    status: FriendStatusEnum,
    manager: EntityManager,
  ): Promise<UpdateResult>;
}

@Injectable()
export class FriendRepository
  extends Repository<Friend>
  implements IFriendRepository
{
  private logger = new Logger('Friend Repository');

  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {
    super(Friend, dataSource.createEntityManager());
  }

  async saveFriend(
    userId: string,
    friendId: string,
    manager: EntityManager,
  ): Promise<Friend> {
    this.logger.log(`Saving the friend with id:${friendId}`);

    return manager.save(Friend, { userId, friendId });
  }

  async updateStatus(
    id: string,
    status: FriendStatusEnum,
    manager: EntityManager,
  ): Promise<UpdateResult> {
    this.logger.log(`Updating the friend's couple status with id:${id}`);

    return manager.update(Friend, { id }, { status });
  }

  async findOneByUserIdAndFriendId(
    userId: string,
    friendId: string,
  ): Promise<Friend> {
    this.logger.log(
      `Finding the friend's couple by user with id:${userId} and friend id:${friendId}`,
    );

    return this.findOne({
      where: { userId, friendId },
      relations: ['request'],
    });
  }

  async isUserBlocked(userId: string, friendId: string): Promise<boolean> {
    return this.exist({
      where: {
        userId: friendId,
        friendId: userId,
        status: FriendStatusEnum.BLOCKED,
      },
    });
  }
}
