import { Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityManager, Repository, UpdateResult } from 'typeorm';
import { Friend, FriendStatusEnum } from '../entity';
import { InjectDataSource } from '@nestjs/typeorm';

export interface IFriendRepository {
  findManyPendingFriendsWithCommonFriends(userId: string): Promise<Friend[]>;

  findOneByUserIdAndFriendId(userId: string, friendId: string): Promise<Friend>;

  findOnePendingByIdAndUserId(id: string, userId: string): Promise<Friend>;

  findOneAcceptedByUserIdAndFriendId(
    userId: string,
    friendId: string,
  ): Promise<Friend>;

  findManyAcceptedFriendsByUserIdWithCommonFriends(
    userId: string,
  ): Promise<Friend[]>;

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

    return manager.save(Friend, { user: userId, friendId, ...data });
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
      where: { user: { id: userId }, friendId },
      relations: ['user'],
    });
  }

  async findOnePendingByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<Friend> {
    this.logger.log(
      `Finding the pending friend's couple by id:${id} and user with id:${userId}`,
    );

    return this.findOne({
      where: { friendId: userId, id, status: FriendStatusEnum.PENDING },
      relations: ['user'],
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
      where: {
        user: { id: userId },
        friendId,
        status: FriendStatusEnum.ACCEPTED,
      },
    });
  }

  async findManyPendingFriendsWithCommonFriends(
    userId: string,
  ): Promise<Friend[]> {
    this.logger.log(
      `Finding pending friend couples for a user with id:${userId} and with common friends`,
    );
    return await this.query(
      `SELECT friend.id, u.id as "friendId",u.first_name as "firstName",u.second_name as "secondName", u.image_url as "imageUrl",
              (SELECT COUNT(*)
               FROM (SELECT DISTINCT "friendId"
                     FROM friend
                     WHERE "userId" = 'eaaebe3d-3b8f-4694-bd8c-7a9daf8a5765'
                       AND status = 'accepted'
                     INTERSECT
                     SELECT DISTINCT "friendId"
                     FROM friend
                     WHERE "userId" = u.id
                       AND status = 'accepted') AS common_friends) AS "commonFriends"
       FROM friend
                LEFT JOIN "user" u ON u.id = friend."friendId"
       WHERE friend."userId" = '${userId}'
         AND friend.status = 'pending'`,
    );
  }
  async findManyAcceptedFriendsByUserIdWithCommonFriends(
    userId: string,
  ): Promise<Friend[]> {
    this.logger.log(
      `Finding accepted friend couples for a user with id:${userId} and with common friends`,
    );
    return await this.query(
      `SELECT friend.id, u.id as "friendId",u.first_name as "firstName",u.second_name as "secondName", u.image_url as "imageUrl",
              (SELECT COUNT(*)
               FROM (SELECT DISTINCT "friendId"
                     FROM friend
                     WHERE "userId" = 'eaaebe3d-3b8f-4694-bd8c-7a9daf8a5765'
                       AND status = 'accepted'
                     INTERSECT
                     SELECT DISTINCT "friendId"
                     FROM friend
                     WHERE "userId" = u.id
                       AND status = 'accepted') AS common_friends) AS "commonFriends"
       FROM friend
                LEFT JOIN "user" u ON u.id = friend."friendId"
       WHERE friend."userId" = '${userId}'
         AND friend.status = 'accepted'`,
    );
  }

  async isUserBlocked(userId: string, friendId: string): Promise<boolean> {
    this.logger.log(
      `Finding if friend with id:${friendId} is blocked by user with id:${userId}`,
    );

    return this.exist({
      where: {
        user: { id: friendId },
        friendId: userId,
        status: FriendStatusEnum.BLOCKED,
      },
    });
  }
}
