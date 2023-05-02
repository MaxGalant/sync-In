import { Injectable, Logger } from '@nestjs/common';
import {
  DataSource,
  EntityManager,
  In,
  Repository,
  UpdateResult,
} from 'typeorm';
import { User } from '../entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { CreateUserDto, UpdateUserDto } from '../dto';

export interface IUserRepository {
  saveUser(createUserDto: CreateUserDto, manager: EntityManager): Promise<User>;

  updateFields(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult>;

  findOneById(id: string): Promise<User>;

  findManyByName(name: string): Promise<User[]>;
  findManyByIds(ids: string[]): Promise<User[]>;
}

@Injectable()
export class UserRepository
  extends Repository<User>
  implements IUserRepository
{
  private logger = new Logger('User Repository');

  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {
    super(User, dataSource.createEntityManager());
  }

  async saveUser(
    createUserDto: CreateUserDto,
    manager: EntityManager,
  ): Promise<User> {
    this.logger.log('Saving a user');

    try {
      return manager.save(User, createUserDto);
    } catch (error) {
      this.logger.error('Something went wrong when save user', error?.stack);
    }
  }

  async findOneById(id: string): Promise<User> {
    this.logger.log(`Finding a user by id: ${id}`);

    try {
      return this.findOne({ where: { id, active: true } });
    } catch (error) {
      this.logger.error(
        `Something went wrong when finding a user by id: ${id}`,
        error?.stack,
      );
    }
  }

  async updateFields(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    this.logger.log(`Updating a user with id:${userId}`);

    try {
      return this.update({ id: userId }, updateUserDto);
    } catch (error) {
      this.logger.error(
        `Something went wrong when updating a user with id:${userId}`,
        error?.stack,
      );
    }
  }

  async findManyByName(name: string): Promise<User[]> {
    this.logger.log(`Finding users by name ${name} `);

    return this.createQueryBuilder('user')
      .where('user.first_name LIKE :name', { name: `%${name}%` })
      .orWhere('user.second_name LIKE :name', { name: `%${name}%` })
      .orWhere('user.nickname LIKE :name', { name: `%${name}%` })
      .getMany();
  }

  async findManyByIds(ids: string[]): Promise<User[]> {
    this.logger.log(`Finding users with ids: ${ids} '`);

    return this.find({
      where: {
        id: In(ids),
      },
    });
  }
}
