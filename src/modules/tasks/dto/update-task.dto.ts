import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTaskDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  text: string;
}
