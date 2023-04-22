import { Injectable, Logger } from '@nestjs/common';
import {
  ITasksRepository,
  TasksRepository,
} from './repository/tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto';
import { ErrorDto, SuccessResponseDto } from '../../../utills';
import { DataSource } from 'typeorm';
import {
  GroupsRepository,
  IGroupsRepository,
} from '../groups/repository/groups.repository';

export interface ITasksService {
  create(
    createTaskDto: CreateTaskDto,
    userId: string,
  ): Promise<SuccessResponseDto | ErrorDto>;
  update(
    text: string,
    taskId: string,
    userId: string,
  ): Promise<SuccessResponseDto | ErrorDto>;
  delete(
    taskId: string,
    userId: string,
  ): Promise<SuccessResponseDto | ErrorDto>;
  getTask(
    groupId: string,
    userId: string,
  ): Promise<SuccessResponseDto | ErrorDto>;
}

@Injectable()
export class TasksService implements ITasksService {
  private logger = new Logger('Task Service');

  constructor(
    @InjectRepository(TasksRepository)
    private readonly tasksRepository: ITasksRepository,
    @InjectRepository(GroupsRepository)
    private readonly groupsRepository: IGroupsRepository,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createTaskDto: CreateTaskDto,
    userId: string,
  ): Promise<SuccessResponseDto | ErrorDto> {
    this.logger.log('Creating task');

    const queryRunner = this.dataSource.createQueryRunner();

    const { manager } = queryRunner;

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const group = await this.groupsRepository.findOneAcceptedByIdAndUserId(
        createTaskDto.groupId,
        userId,
      );

      const week = group.weeks[0];

      if (!group || !week) {
        return new ErrorDto(404, 'Not Found', `Group doesn't exists`);
      }

      const isUserTaskExist = week.tasks.reduce((flag, task) => {
        if (task.created_by === userId) {
          flag = true;
        }

        return flag;
      }, false);

      if (isUserTaskExist) {
        return new ErrorDto(409, 'Conflict', `User already has added task`);
      }

      const createObj = {
        created_by: userId,
        text: createTaskDto.text,
        week: week,
      };

      const task = await this.tasksRepository.saveTask(createObj, manager);

      await queryRunner.commitTransaction();

      return {
        statusCode: 200,
        message: 'Task was successfully created',
        data: task,
      };
    } catch (error) {
      this.logger.error(
        `Something went wrong while creating task`,
        error?.stack,
      );

      await queryRunner.rollbackTransaction();

      return new ErrorDto(
        500,
        'Server error',
        `Something went wrong while creating task`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async update(
    text: string,
    taskId: string,
    userId: string,
  ): Promise<SuccessResponseDto | ErrorDto> {
    this.logger.log('Updating task');

    try {
      const task = await this.tasksRepository.findOneByIdAndUserId(
        taskId,
        userId,
      );

      if (!task) {
        return new ErrorDto(404, 'Not Found', `Task doesn't exists`);
      }

      await this.tasksRepository.updateText(taskId, text);

      return {
        statusCode: 200,
        message: 'Task was successfully updated',
        data: {},
      };
    } catch (error) {
      this.logger.error(
        `Something went wrong while updating task`,
        error?.stack,
      );

      return new ErrorDto(
        500,
        'Server error',
        `Something went wrong while updating task`,
      );
    }
  }

  async delete(
    taskId: string,
    userId: string,
  ): Promise<SuccessResponseDto | ErrorDto> {
    this.logger.log('Delete task');

    try {
      const task = await this.tasksRepository.findOneByIdAndUserId(
        taskId,
        userId,
      );

      if (!task) {
        return new ErrorDto(404, 'Not Found', `Task doesn't exists`);
      }

      await this.tasksRepository.removeOneTask(taskId);

      return {
        statusCode: 200,
        message: 'Task was successfully deleted',
        data: {},
      };
    } catch (error) {
      this.logger.error(
        `Something went wrong while deleting task`,
        error?.stack,
      );

      return new ErrorDto(
        500,
        'Server error',
        `Something went wrong while deleting task`,
      );
    }
  }

  async getTask(
    groupId: string,
    userId: string,
  ): Promise<SuccessResponseDto | ErrorDto> {
    this.logger.log("Get user's group task");

    try {
      const task = await this.tasksRepository.findOneByGroupIdAndUserId(
        groupId,
        userId,
      );

      return {
        statusCode: 200,
        message: 'Task was successfully fetched',
        data: task,
      };
    } catch (error) {
      this.logger.error(
        `Something went wrong while fetching user task`,
        error?.stack,
      );

      return new ErrorDto(
        500,
        'Server error',
        `Something went wrong while fetching user task`,
      );
    }
  }
}
