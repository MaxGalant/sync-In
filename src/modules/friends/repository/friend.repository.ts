import { Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityManager, Repository, UpdateResult } from 'typeorm';
import { Friend, FriendStatusEnum } from '../entity';
import { InjectDataSource } from '@nestjs/typeorm';

export interface IFriendRepository {
  findOneByUserIdAndFriendId(userId: string, friendId: string): Promise<Friend>;
  findOneAcceptedByUserIdAndFriendId(
    userId: string,
    friendId: string,
  ): Promise<Friend>;
  findManyAcceptedByUserId(userId: string): Promise<Friend[]>;

  isUserBlocked(userId: string, friendId: string): Promise<boolean>;

  saveFriend(
    userId: string,
    friendId: string,
    manager: EntityManager,
    data?: any,
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
    data?: any,
  ): Promise<Friend> {
    this.logger.log(`Saving the friend with id:${friendId}`);

    return manager.save(Friend, { userId, friendId, ...data });
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

  async findOneAcceptedByUserIdAndFriendId(
    userId: string,
    friendId: string,
  ): Promise<Friend> {
    this.logger.log(
      `Finding the accepted friend's couple by user with id:${userId} and friend id:${friendId}`,
    );

    return this.findOne({
      where: { userId, friendId, status: FriendStatusEnum.ACCEPTED },
    });
  }

  async findManyAcceptedByUserId(userId: string): Promise<Friend[]> {
    this.logger.log(
      `Finding the accepted friend's couple by user with id:${userId} `,
    );

    return this.find({
      where: { userId, status: FriendStatusEnum.ACCEPTED },
    });
  }

  async isUserBlocked(userId: string, friendId: string): Promise<boolean> {
    this.logger.log(
      `Finding if friend with id:${friendId} is blocked by user with id:${userId}`,
    );

    return this.exist({
      where: {
        userId: friendId,
        friendId: userId,
        status: FriendStatusEnum.BLOCKED,
      },
    });
  }
}
