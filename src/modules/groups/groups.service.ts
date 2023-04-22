import { Injectable, Logger } from '@nestjs/common';
import { ErrorDto, SuccessResponseDto } from '../../../utills';
import { CreateGroupDto } from './dto';
import { DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  GroupsRepository,
  IGroupsRepository,
} from './repository/groups.repository';
import {
  IUserRepository,
  UserRepository,
} from '../user/repository/user.repository';
import { GroupUser, GroupUserStatusEnum } from './entity';
import {
  GroupsUsersRepository,
  IGroupsUsersRepository,
} from './repository/groups-users.repository';
import {
  IWeeksRepository,
  WeeksRepository,
} from '../weeks/repository/weeks.repository';

export interface IGroupsService {
  create(
    createGroupDto: CreateGroupDto,
    userId: string,
  ): Promise<SuccessResponseDto | ErrorDto>;
  addUsers(
    users: string[],
    userId: string,
    groupId: string,
  ): Promise<SuccessResponseDto | ErrorDto>;

  getAll(userId: string): Promise<SuccessResponseDto | ErrorDto>;
  getById(
    groupId: string,
    userId: string,
  ): Promise<SuccessResponseDto | ErrorDto>;
  getRequests(userId: string): Promise<SuccessResponseDto | ErrorDto>;
  acceptRequests(
    requestId,
    userId: string,
  ): Promise<SuccessResponseDto | ErrorDto>;
  declineRequests(
    requestId,
    userId: string,
  ): Promise<SuccessResponseDto | ErrorDto>;
}

@Injectable()
export class GroupsService implements IGroupsService {
  private logger = new Logger('Groups Service');

  constructor(
    @InjectRepository(GroupsRepository)
    private readonly groupsRepository: IGroupsRepository,
    @InjectRepository(GroupsUsersRepository)
    private readonly groupsUsersRepository: IGroupsUsersRepository,
    @InjectRepository(UserRepository)
    private readonly userRepository: IUserRepository,
    @InjectRepository(WeeksRepository)
    private readonly weeksRepository: IWeeksRepository,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createGroupDto: CreateGroupDto,
    userId: string,
  ): Promise<SuccessResponseDto | ErrorDto> {
    this.logger.log(`Create group`);

    const queryRunner = this.dataSource.createQueryRunner();

    const { manager } = queryRunner;

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const createObjGroup = {
        ownerId: userId,
        created_by: userId,
        name: createGroupDto.name,
        imageUrl: createGroupDto.imageUrl,
      };

      const group = await this.groupsRepository.saveGroup(
        createObjGroup,
        manager,
      );

      const createObjWeek = {
        group,
        created_by: userId,
        name: createGroupDto.name,
        imageUrl: createGroupDto.imageUrl,
      };

      await this.weeksRepository.saveWeek(createObjWeek, manager);

      if (createGroupDto.userIds.length) {
        createGroupDto.userIds.push(userId);

        const users = await this.userRepository.findManyByIds(
          createGroupDto.userIds,
        );

        const usersArr = users.map(
          (user) =>
            new GroupUser(
              user,
              group,
              user.id === userId
                ? GroupUserStatusEnum.ACCEPTED
                : GroupUserStatusEnum.PENDING,
            ),
        );
        await this.groupsUsersRepository.saveGroupUser(usersArr, manager);
      }

      await queryRunner.commitTransaction();

      return {
        statusCode: 200,
        message: 'Group was successfully created',
        data: group,
      };
    } catch (error) {
      this.logger.error(
        `Something went wrong while creating group`,
        error?.stack,
      );

      await queryRunner.rollbackTransaction();

      return new ErrorDto(
        500,
        'Server error',
        `Something went wrong while creating group`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async addUsers(
    usersIds: string[],
    userId: string,
    groupId: string,
  ): Promise<SuccessResponseDto | ErrorDto> {
    this.logger.log(`Add users to group`);

    const queryRunner = this.dataSource.createQueryRunner();

    const { manager } = queryRunner;

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const group = await this.groupsRepository.findOneByIdAndOwnerId(
        groupId,
        userId,
      );

      if (!group) {
        return new ErrorDto(404, 'Not Found', `Group doesn't exists`);
      }

      const groupUsersIds = usersIds.filter(
        (usersId) =>
          !group.users.some((userGroup) => userGroup.user.id === usersId),
      );

      const users = await this.userRepository.findManyByIds(groupUsersIds);

      const usersArr = users.map(
        (user) =>
          new GroupUser(
            user,
            group,
            user.id === userId
              ? GroupUserStatusEnum.ACCEPTED
              : GroupUserStatusEnum.PENDING,
          ),
      );

      await this.groupsUsersRepository.saveGroupUser(usersArr, manager);

      await queryRunner.commitTransaction();

      return {
        statusCode: 200,
        message: 'Group request was successfully send to user',
        data: group,
      };
    } catch (error) {
      this.logger.error(
        `Something went wrong while add user to group`,
        error?.stack,
      );

      await queryRunner.rollbackTransaction();

      return new ErrorDto(
        500,
        'Server error',
        `Something went wrong while add user to group`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async getAll(userId: string): Promise<SuccessResponseDto | ErrorDto> {
    this.logger.log(`Get groups`);

    try {
      const groups = await this.groupsRepository.findManyAcceptedByUserId(
        userId,
      );

      return {
        statusCode: 200,
        message: 'Groups requests was successfully fetched',
        data: groups,
      };
    } catch (error) {
      this.logger.error(
        `Something went wrong while getting groups`,
        error?.stack,
      );

      return new ErrorDto(
        500,
        'Server error',
        `Something went wrong while getting groups`,
      );
    }
  }

  async getById(
    groupId: string,
    userId: string,
  ): Promise<SuccessResponseDto | ErrorDto> {
    this.logger.log(`Get group with id:${groupId}`);

    try {
      const group = await this.groupsRepository.findOneAcceptedByIdAndUserId(
        groupId,
        userId,
      );

      if (!group) {
        return new ErrorDto(404, 'Not Found', `Group doesn't exists`);
      }

      return {
        statusCode: 200,
        message: 'Groups requests was successfully fetched',
        data: group,
      };
    } catch (error) {
      this.logger.error(
        `Something went wrong while getting groups`,
        error?.stack,
      );

      return new ErrorDto(
        500,
        'Server error',
        `Something went wrong while getting groups`,
      );
    }
  }
  async getRequests(userId: string): Promise<SuccessResponseDto | ErrorDto> {
    this.logger.log(`Get groups request`);

    try {
      const groupsRequests =
        await this.groupsUsersRepository.findManyPendingByUserId(userId);

      return {
        statusCode: 200,
        message: 'Groups requests was successfully fetched',
        data: groupsRequests,
      };
    } catch (error) {
      this.logger.error(
        `Something went wrong while getting groups requests`,
        error?.stack,
      );

      return new ErrorDto(
        500,
        'Server error',
        `Something went wrong while getting groups requests`,
      );
    }
  }

  async acceptRequests(
    requestId: string,
    userId: string,
  ): Promise<SuccessResponseDto | ErrorDto> {
    this.logger.log(`Accept group request with id:${requestId}`);

    const queryRunner = this.dataSource.createQueryRunner();

    const { manager } = queryRunner;

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const groupsRequest =
        await this.groupsUsersRepository.findOnePendingByUserId(
          requestId,
          userId,
        );

      if (!groupsRequest) {
        return new ErrorDto(404, 'Not Found', `Group request doesn't exists`);
      }

      await this.groupsUsersRepository.updateStatus(
        requestId,
        GroupUserStatusEnum.ACCEPTED,
        manager,
      );

      await queryRunner.commitTransaction();

      return {
        statusCode: 200,
        message: 'Groups request was successfully accepted',
        data: {},
      };
    } catch (error) {
      this.logger.error(
        `Something went wrong while accepting group request`,
        error?.stack,
      );

      await queryRunner.rollbackTransaction();

      return new ErrorDto(
        500,
        'Server error',
        `Something went wrong while accepting group request`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async declineRequests(
    requestId: string,
    userId: string,
  ): Promise<SuccessResponseDto | ErrorDto> {
    this.logger.log(`Decline group request with id:${requestId}`);

    const queryRunner = this.dataSource.createQueryRunner();

    const { manager } = queryRunner;

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const groupsRequest =
        await this.groupsUsersRepository.findOnePendingByUserId(
          requestId,
          userId,
        );

      if (!groupsRequest) {
        return new ErrorDto(404, 'Not Found', `Group doesn't exists`);
      }

      await this.groupsUsersRepository.updateStatus(
        requestId,
        GroupUserStatusEnum.Denied,
        manager,
      );

      await queryRunner.commitTransaction();

      return {
        statusCode: 200,
        message: 'Groups request was successfully declined',
        data: {},
      };
    } catch (error) {
      this.logger.error(
        `Something went wrong while declining group request`,
        error?.stack,
      );

      await queryRunner.rollbackTransaction();

      return new ErrorDto(
        500,
        'Server error',
        `Something went wrong while declining group request`,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
