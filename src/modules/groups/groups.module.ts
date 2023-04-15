import { Module } from '@nestjs/common';
import { GroupsController } from './groups.controller';
import { GroupsService } from './group.service';
import { GroupsRepository } from './repository/groups.repository';
import { UserRepository } from '../user/repository/user.repository';

@Module({
  controllers: [GroupsController],
  providers: [GroupsService, GroupsRepository, UserRepository],
})
export class GroupsModule {}
