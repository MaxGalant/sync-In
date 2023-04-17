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

export interface IGroupsService {
  create(
    createGroupDto: CreateGroupDto,
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
      const createObj = {
        ownerId: userId,
        created_by: userId,
        name: createGroupDto.name,
        imageUrl: createGroupDto.imageUrl,
      };

      const group = await this.groupsRepository.saveGroup(createObj, manager);

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
}
