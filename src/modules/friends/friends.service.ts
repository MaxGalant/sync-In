import { Injectable, Logger } from '@nestjs/common';
import { ErrorDto, SuccessResponseDto } from '../../../utills';
import { DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendRepository, IFriendRepository } from './repository';
import {
  FriendRequestRepository,
  IFriendRequestRepository,
} from './repository';
import { FriendStatusEnum } from './entity';

export interface IFriendsService {
  sendRequest(
    friendId: string,
    userId: string,
  ): Promise<SuccessResponseDto | ErrorDto>;

  acceptRequest(
    requestId: string,
    userId: string,
  ): Promise<SuccessResponseDto | ErrorDto>;
  declineRequest(
    requestId: string,
    userId: string,
  ): Promise<SuccessResponseDto | ErrorDto>;
}

@Injectable()
export class FriendsService implements IFriendsService {
  private logger = new Logger('Friends Service');

  constructor(
    @InjectRepository(FriendRepository)
    private readonly friendRepository: IFriendRepository,
    @InjectRepository(FriendRequestRepository)
    private readonly friendRequestRepository: IFriendRequestRepository,
    private readonly dataSource: DataSource,
  ) {}

  async sendRequest(
    friendId: string,
    userId: string,
  ): Promise<SuccessResponseDto | ErrorDto> {
    this.logger.log(`Send friend request to user with id: ${friendId}`);

    const queryRunner = this.dataSource.createQueryRunner();

    const { manager } = queryRunner;

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      await queryRunner.commitTransaction();

      let friendCouple = await this.friendRepository.findOneByUserIdAndFriendId(
        userId,
        friendId,
      );

      if (!friendCouple) {
        friendCouple = await this.friendRepository.saveFriend(
          userId,
          friendId,
          manager,
        );
      }

      if (friendCouple.status === FriendStatusEnum.ACCEPTED) {
        return new ErrorDto(409, 'Conflict', `We already are friends`);
      }

      const isBlocked = await this.friendRepository.isUserBlocked(
        userId,
        friendId,
      );

      if (isBlocked) {
        return new ErrorDto(409, 'Conflict', `User has blocked you`);
      }

      if (friendCouple.request) {
        return new ErrorDto(409, 'Conflict', `You already have sent request`);
      }

      await this.friendRequestRepository.saveFriendRequest(
        friendCouple,
        manager,
      );

      return {
        statusCode: 200,
        message: 'Friend request was successfully sent',
        data: {},
      };
    } catch (error) {
      this.logger.error(
        `Something went wrong while sending friend request to user with id: ${friendId}`,
        error?.stack,
      );

      await queryRunner.startTransaction();

      return new ErrorDto(
        500,
        'Server error',
        `Something went wrong while sending friend request to user with id: ${friendId}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async acceptRequest(
    requestId: string,
    userId: string,
  ): Promise<SuccessResponseDto | ErrorDto> {
    this.logger.log('Accepting the friend request with id:${requestId}');

    const queryRunner = this.dataSource.createQueryRunner();

    const { manager } = queryRunner;

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      await queryRunner.commitTransaction();

      const request = await this.friendRequestRepository.findOneByIdAndUserId(
        requestId,
        userId,
      );

      if (!request) {
        return new ErrorDto(404, 'Not Found', `The request doesn't exist`);
      }

      await this.friendRepository.updateStatus(
        request.friendCouple.id,
        FriendStatusEnum.ACCEPTED,
        manager,
      );

      await this.friendRequestRepository.deleteById(request.id, manager);

      return {
        statusCode: 200,
        message: 'Request was successfully accepted',
        data: {},
      };
    } catch (error) {
      this.logger.error(
        `Something went wrong while accepting the friend request with id:${requestId}`,
        error?.stack,
      );

      await queryRunner.startTransaction();

      return new ErrorDto(
        500,
        'Server error',
        `Something went wrong while accepting the friend request with id:${requestId}`,
      );
    } finally {
      await queryRunner.release();
    }
  }
  async declineRequest(
    requestId: string,
    userId: string,
  ): Promise<SuccessResponseDto | ErrorDto> {
    this.logger.log('Declining the friend request with id:${requestId}');

    const queryRunner = this.dataSource.createQueryRunner();

    const { manager } = queryRunner;

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      await queryRunner.commitTransaction();

      const request = await this.friendRequestRepository.findOneByIdAndUserId(
        requestId,
        userId,
      );

      if (!request) {
        return new ErrorDto(404, 'Not Found', `The request doesn't exist`);
      }

      await this.friendRepository.updateStatus(
        request.friendCouple.id,
        FriendStatusEnum.DECLINED,
        manager,
      );

      await this.friendRequestRepository.deleteById(request.id, manager);

      return {
        statusCode: 200,
        message: 'Request was successfully declined',
        data: {},
      };
    } catch (error) {
      this.logger.error(
        `Something went wrong while declining the friend request with id:${requestId}`,
        error?.stack,
      );

      await queryRunner.startTransaction();

      return new ErrorDto(
        500,
        'Server error',
        `Something went wrong while declining the friend request with id:${requestId}`,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
