import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto, UpdateUserInfoDto, UserProfileInfoDto } from './dto';
import { IUserRepository, UserRepository } from './repository/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { User } from './entity';
import { ErrorDto } from '../../../utills';
import { PayloadRequestInterface } from '../../../utills/interfaces/payload-request.interface';
import { DataSource } from 'typeorm';

export interface IUserService {
  updateInfo(
    req: PayloadRequestInterface,
    updateUserInfoDto: UpdateUserInfoDto,
  ): Promise<string | ErrorDto>;
  getById(userId: string): Promise<User | ErrorDto>;
  getByIds(userId: string[]): Promise<UserProfileInfoDto[] | ErrorDto>;
  search(name: string): Promise<UserProfileInfoDto[] | ErrorDto>;
  create(message: any): Promise<void>;
}

@Injectable()
export class UserService implements IUserService {
  private logger = new Logger('User Service');

  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: IUserRepository,
    private readonly dataSource: DataSource,
  ) {}

  async create(message: CreateUserDto): Promise<void> {
    this.logger.log('User creating');

    const queryRunner = this.dataSource.createQueryRunner();

    const { manager } = queryRunner;

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const { id } = message;

      const user = await this.userRepository.findOneById(id);

      if (user) {
        this.logger.error('User already exists');
      }

      await this.userRepository.saveUser(message, manager);

      await queryRunner.commitTransaction();

      this.logger.log('User was successfully migrated');
    } catch (error) {
      this.logger.error('Something went wrong when create user', error?.stack);

      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async updateInfo(
    req: PayloadRequestInterface,
    updateUserInfoDto: UpdateUserInfoDto,
  ): Promise<string | ErrorDto> {
    this.logger.log("Updating a user's profile indo");
    try {
      const { user } = req;

      await this.userRepository.updateFields(user.id, updateUserInfoDto);

      return "User's profile info successfully updated";
    } catch (error) {
      return new ErrorDto(
        500,
        'Server error',
        "Something went wrong when updating a user's profile info",
      );
    }
  }

  async getById(userId: string): Promise<UserProfileInfoDto | ErrorDto> {
    this.logger.log('Getting a user by id"');
    try {
      const user = await this.userRepository.findOneById(userId);

      if (!user) {
        return new ErrorDto(
          404,
          'Not Found',
          `User with id:${userId} doesn't exist`,
        );
      }

      return plainToClass(UserProfileInfoDto, user);
    } catch (error) {
      return new ErrorDto(
        500,
        'Server error',
        'Something went wrong when getting a user by id',
      );
    }
  }

  async getByIds(usersIds: string[]): Promise<UserProfileInfoDto[] | ErrorDto> {
    this.logger.log('Getting users by ids"');
    try {
      const users = await this.userRepository.findManyByIds(usersIds);

      return plainToClass(UserProfileInfoDto, users);
    } catch (error) {
      return new ErrorDto(
        500,
        'Server error',
        'Something went wrong when getting users by ids',
      );
    }
  }

  async search(name: string): Promise<UserProfileInfoDto[] | ErrorDto> {
    this.logger.log(`Searching users by name: ${name}`);

    try {
      const users = await this.userRepository.findManyByName(name);

      return plainToClass(UserProfileInfoDto, users);
    } catch (error) {
      return new ErrorDto(
        500,
        'Server error',
        `Something went wrong when searching users by name: ${name}`,
      );
    }
  }
}
