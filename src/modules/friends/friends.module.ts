import { Module } from '@nestjs/common';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { FriendRepository } from './repository';
import { FriendRequestRepository } from './repository';

@Module({
  controllers: [FriendsController],
  providers: [FriendsService, FriendRepository, FriendRequestRepository],
})
export class FriendsModule {}
