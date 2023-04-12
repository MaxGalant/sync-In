import { ApiProperty } from '@nestjs/swagger';

export class FriendsRequestDto {
  @ApiProperty()
  friendId: string;
}
