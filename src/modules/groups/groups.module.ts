import { Module } from '@nestjs/common';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { GroupsRepository } from './repository/groups.repository';
import { UserRepository } from '../user/repository/user.repository';
import { GroupsUsersRepository } from './repository/groups-users.repository';

@Module({
  controllers: [GroupsController],
  providers: [
    GroupsService,
    GroupsRepository,
    GroupsUsersRepository,
    UserRepository,
  ],
})
export class GroupsModule {}
