import { Injectable, Logger } from '@nestjs/common';
import { ErrorDto, SuccessResponseDto } from '../../../utills';
import { DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendRepository, IFriendRepository } from './repository';
import { FriendStatusEnum } from './entity';
import {
  IUserRepository,
  UserRepository,
} from '../user/repository/user.repository';

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
  deleteFriend(
    friendId: string,
    userId: string,
  ): Promise<SuccessResponseDto | ErrorDto>;
  blockFriend(
    friendId: string,
    userId: string,
  ): Promise<SuccessResponseDto | ErrorDto>;
  unblockFriend(
    friendId: string,
    userId: string,
  ): Promise<SuccessResponseDto | ErrorDto>;
  getFriendRequests(userId: string): Promise<SuccessResponseDto | ErrorDto>;
  getFriends(userId: string): Promise<SuccessResponseDto | ErrorDto>;
}

@Injectable()
export class FriendsService implements IFriendsService {
  private logger = new Logger('Friends Service');

  constructor(
    @InjectRepository(FriendRepository)
    private readonly friendRepository: IFriendRepository,
    @InjectRepository(UserRepository)
    private readonly userRepository: IUserRepository,
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
      if (friendId === userId) {
        return new ErrorDto(
          409,
          'Conflict',
          `You can't send request to yourself`,
        );
      }

      const friend = await this.userRepository.findOneById(friendId);

      if (!friend) {
        return new ErrorDto(
          404,
          'Not Found',
          `User with id:${friendId} doesn't exist`,
        );
      }

      const isBlocked = await this.friendRepository.isUserBlocked(
        userId,
        friendId,
      );

      if (isBlocked) {
        return new ErrorDto(409, 'Conflict', `User has blocked you`);
      }

      const friendCouple =
        await this.friendRepository.findOneByUserIdAndFriendId(
          userId,
          friendId,
        );

      if (friendCouple) {
        if (friendCouple.status === FriendStatusEnum.PENDING) {
          return new ErrorDto(409, 'Conflict', `You already have sent request`);
        }

        if (friendCouple.status === FriendStatusEnum.ACCEPTED) {
          return new ErrorDto(409, 'Conflict', `You already are friends`);
        }

        await this.friendRepository.updateStatus(
          friendCouple.id,
          FriendStatusEnum.PENDING,
          manager,
        );

        await queryRunner.commitTransaction();

        return {
          statusCode: 200,
          message: 'Friend request was successfully sent',
          data: {},
        };
      }

      await this.friendRepository.saveFriend(userId, friendId, manager);

      await queryRunner.commitTransaction();

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

      await queryRunner.rollbackTransaction();

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
    this.logger.log(`Accepting the friend request with id:${requestId}`);

    const queryRunner = this.dataSource.createQueryRunner();

    const { manager } = queryRunner;

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const friendCouple =
        await this.friendRepository.findOnePendingByIdAndUserId(
          requestId,
          userId,
        );

      if (!friendCouple) {
        return new ErrorDto(404, 'Not Found', `The request doesn't exist`);
      }

      await this.friendRepository.updateStatus(
        friendCouple.id,
        FriendStatusEnum.ACCEPTED,
        manager,
      );

      await queryRunner.commitTransaction();

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

      await queryRunner.rollbackTransaction();

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
    this.logger.log(`Declining the friend request with id:${requestId}`);

    const queryRunner = this.dataSource.createQueryRunner();

    const { manager } = queryRunner;

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const friendCouple =
        await this.friendRepository.findOnePendingByIdAndUserId(
          requestId,
          userId,
        );

      if (!friendCouple) {
        return new ErrorDto(404, 'Not Found', `The request doesn't exist`);
      }

      await this.friendRepository.updateStatus(
        friendCouple.id,
        FriendStatusEnum.DECLINED,
        manager,
      );

      await queryRunner.commitTransaction();

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

      await queryRunner.rollbackTransaction();

      return new ErrorDto(
        500,
        'Server error',
        `Something went wrong while declining the friend request with id:${requestId}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async deleteFriend(
    friendId: string,
    userId: string,
  ): Promise<SuccessResponseDto | ErrorDto> {
    this.logger.log(`Delete the friend with id:${friendId}`);

    const queryRunner = this.dataSource.createQueryRunner();

    const { manager } = queryRunner;

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const friend = await this.userRepository.findOneById(friendId);

      if (!friend) {
        return new ErrorDto(
          404,
          'Not Found',
          `User with id:${friendId} doesn't exist`,
        );
      }

      const friendCouple =
        await this.friendRepository.findOneAcceptedByUserIdAndFriendId(
          userId,
          friendId,
        );

      if (!friendCouple) {
        return new ErrorDto(
          404,
          'Not Found',
          `You don't have friend with id:${friendId}`,
        );
      }

      await this.friendRepository.updateStatus(
        friendCouple.id,
        FriendStatusEnum.DECLINED,
        manager,
      );

      await queryRunner.commitTransaction();

      return {
        statusCode: 200,
        message: 'Friend was successfully deleted',
        data: {},
      };
    } catch (error) {
      this.logger.error(
        `Something went wrong while deleting friend with id:${friendId}`,
        error?.stack,
      );

      await queryRunner.rollbackTransaction();

      return new ErrorDto(
        500,
        'Server error',
        `Something went wrong while deleting friend with id:${friendId}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async blockFriend(
    friendId: string,
    userId: string,
  ): Promise<SuccessResponseDto | ErrorDto> {
    this.logger.log(`Block the user with id:${friendId}`);

    const queryRunner = this.dataSource.createQueryRunner();

    const { manager } = queryRunner;

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const friend = await this.userRepository.findOneById(friendId);

      if (!friend) {
        return new ErrorDto(
          404,
          'Not Found',
          `User with id:${friendId} doesn't exist`,
        );
      }

      const isUserBlocked = await this.friendRepository.isUserBlocked(
        friendId,
        userId,
      );

      if (isUserBlocked) {
        return new ErrorDto(
          409,
          'Conflict',
          `User with id:${friendId} already is blocked`,
        );
      }

      const friendCouple =
        await this.friendRepository.findOneByUserIdAndFriendId(
          userId,
          friendId,
        );

      if (friendCouple) {
        await this.friendRepository.updateStatus(
          friendCouple.id,
          FriendStatusEnum.BLOCKED,
          manager,
        );

        await queryRunner.commitTransaction();

        return {
          statusCode: 200,
          message: 'User was successfully blocked',
          data: {},
        };
      }

      await this.friendRepository.saveFriend(userId, friendId, manager, {
        status: FriendStatusEnum.BLOCKED,
      });

      await queryRunner.commitTransaction();

      return {
        statusCode: 200,
        message: 'User was successfully blocked',
        data: {},
      };
    } catch (error) {
      this.logger.error(
        `Something went wrong while blocking user with id:${friendId}`,
        error?.stack,
      );

      await queryRunner.rollbackTransaction();

      return new ErrorDto(
        500,
        'Server error',
        `Something went wrong while blocking user with id:${friendId}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async unblockFriend(
    friendId: string,
    userId: string,
  ): Promise<SuccessResponseDto | ErrorDto> {
    this.logger.log(`Unblock the user with id:${friendId}`);

    const queryRunner = this.dataSource.createQueryRunner();

    const { manager } = queryRunner;

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const friend = await this.userRepository.findOneById(friendId);

      if (!friend) {
        return new ErrorDto(
          404,
          'Not Found',
          `User with id:${friendId} doesn't exist`,
        );
      }

      const friendCouple =
        await this.friendRepository.findOneByUserIdAndFriendId(
          userId,
          friendId,
        );

      if (!friendCouple || friendCouple.status !== FriendStatusEnum.BLOCKED) {
        return new ErrorDto(
          404,
          'Conflict',
          `You don't have a blocked user with id:${friendId}`,
        );
      }

      await this.friendRepository.updateStatus(
        friendCouple.id,
        FriendStatusEnum.ACCEPTED,
        manager,
      );

      await queryRunner.commitTransaction();

      return {
        statusCode: 200,
        message: 'User was successfully unblocked',
        data: {},
      };
    } catch (error) {
      this.logger.error(
        `Something went wrong while unblocking user with id:${friendId}`,
        error?.stack,
      );

      await queryRunner.rollbackTransaction();

      return new ErrorDto(
        500,
        'Server error',
        `Something went wrong while unblocking user with id:${friendId}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async getFriendRequests(
    userId: string,
  ): Promise<SuccessResponseDto | ErrorDto> {
    this.logger.log(`Fetch the user's requests`);

    try {
      const requests =
        await this.friendRepository.findManyPendingFriendsWithCommonFriends(
          userId,
        );

      return {
        statusCode: 200,
        message: "User's requests was successfully fetching",
        data: requests,
      };
    } catch (error) {
      this.logger.error(
        `Something went wrong while fetching user's requests`,
        error?.stack,
      );

      return new ErrorDto(
        500,
        'Server error',
        `Something went wrong while fetching user's requests`,
      );
    }
  }

  async getFriends(userId: string): Promise<SuccessResponseDto | ErrorDto> {
    this.logger.log(`Fetch the user's friends`);

    try {
      const friends =
        await this.friendRepository.findManyAcceptedFriendsByUserIdWithCommonFriends(
          userId,
        );

      return {
        statusCode: 200,
        message: "User's friends was successfully fetching",
        data: friends,
      };
    } catch (error) {
      this.logger.error(
        `Something went wrong while fetching user's friends`,
        error?.stack,
      );

      return new ErrorDto(
        500,
        'Server error',
        `Something went wrong while fetching user's friends`,
      );
    }
  }
}
