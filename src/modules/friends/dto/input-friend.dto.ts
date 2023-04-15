import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class InputFriendDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  friendId: string;
}
