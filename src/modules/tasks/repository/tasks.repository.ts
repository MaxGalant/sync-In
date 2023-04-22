import { Injectable, Logger } from '@nestjs/common';
import {
  DataSource,
  DeleteResult,
  EntityManager,
  Repository,
  UpdateResult,
} from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Task } from '../entity/task.entity';

export interface ITasksRepository {
  saveTask(createData: any, manager: EntityManager): Promise<Task>;
  findOneByIdAndUserId(id: string, userId: string): Promise<Task>;
  findOneByGroupIdAndUserId(groupId: string, userId: string): Promise<Task>;
  updateText(id: string, text: string): Promise<UpdateResult>;
  removeOneTask(id: string): Promise<DeleteResult>;
}

@Injectable()
export class TasksRepository
  extends Repository<Task>
  implements ITasksRepository
{
  private logger = new Logger('Task Repository');

  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {
    super(Task, dataSource.createEntityManager());
  }

  async saveTask(createData: any, manager: EntityManager): Promise<Task> {
    this.logger.log(`Saving tasks`);

    return manager.save(Task, { ...createData });
  }

  async findOneByIdAndUserId(id: string, userId: string): Promise<Task> {
    this.logger.log(
      `Finding tasks with id:${id} and created by user with id:${userId}`,
    );

    return this.findOne({ where: { id, created_by: userId } });
  }

  async findOneByGroupIdAndUserId(
    groupId: string,
    userId: string,
  ): Promise<Task> {
    this.logger.log(
      `Finding task in group with id:${groupId} and created by user with id:${userId}`,
    );

    return this.findOne({
      where: { week: { group: { id: groupId } }, created_by: userId },
    });
  }

  async updateText(id: string, text: string): Promise<UpdateResult> {
    this.logger.log(`Update task with id:${id}`);

    return this.update({ id }, { text });
  }
  async removeOneTask(id: string): Promise<DeleteResult> {
    this.logger.log(`Delete task with id:${id}`);

    return this.delete({ id });
  }
}
