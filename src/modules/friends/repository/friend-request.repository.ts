import { Injectable, Logger } from '@nestjs/common';
import { DataSource, DeleteResult, EntityManager, Repository } from 'typeorm';
import { Friend, FriendRequest } from '../entity';
import { InjectDataSource } from '@nestjs/typeorm';

export interface IFriendRequestRepository {
  saveFriendRequest(
    friendCouple: Friend,
    manager: EntityManager,
  ): Promise<FriendRequest>;

  findOneByIdAndUserId(id: string, userId: string): Promise<FriendRequest>;

  deleteById(id: string, manager: EntityManager): Promise<DeleteResult>;
}

@Injectable()
export class FriendRequestRepository
  extends Repository<FriendRequest>
  implements IFriendRequestRepository
{
  private logger = new Logger('Friend Request Repository');

  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {
    super(FriendRequest, dataSource.createEntityManager());
  }

  async saveFriendRequest(
    friendCouple: Friend,
    manager: EntityManager,
  ): Promise<FriendRequest> {
    this.logger.log(
      `Saving the request for friend couple with id :${friendCouple.id}`,
    );

    return manager.save(FriendRequest, { friendCouple });
  }

  async findOneByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<FriendRequest> {
    this.logger.log(`Finding the request by id:${id} and user id:${userId}`);

    return this.findOne({
      where: { id, friendCouple: { userId } },
      relations: ['friendCouple'],
    });
  }

  async deleteById(id: string, manager: EntityManager): Promise<DeleteResult> {
    this.logger.log(`Deleting the request by id:${id}`);

    return manager.delete(FriendRequest, { id });
  }
}
