import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TasksRepository } from './repository/tasks.repository';
import { GroupsRepository } from '../groups/repository/groups.repository';

@Module({
  controllers: [TasksController],
  providers: [TasksService, TasksRepository, GroupsRepository],
})
export class TasksModule {}
