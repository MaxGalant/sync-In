import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Please enter field: firstName' })
  @IsString({ message: 'Invalid type' })
  firstName: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Please enter field: secondName' })
  @IsString({ message: 'Invalid type' })
  secondName: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Please enter field: nickname' })
  @IsString({ message: 'Invalid type' })
  nickname: string;
}
