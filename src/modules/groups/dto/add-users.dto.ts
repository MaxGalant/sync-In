import { IsArray, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddUsersDto {
  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  users: string[];
}
