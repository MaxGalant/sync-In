import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserInfoDto, UserProfileInfoDto } from './dto';
import { AccessTokenGuard } from '../auth/gurds';
import { GetUsersByIdsDto } from './dto/get-users-by-ids.dto';
import {
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorDto } from '../../../utills';
import { PayloadRequestInterface } from '../../../utills/interfaces/payload-request.interface';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AccessTokenGuard)
  @Patch('update-info')
  updateInfo(
    @Req() req: PayloadRequestInterface,
    @Body() updateUserInfoDto: UpdateUserInfoDto,
  ): Promise<string | ErrorDto> {
    return this.userService.updateInfo(req, updateUserInfoDto);
  }

  @ApiOperation({
    summary: 'Fetching users by ids',
    description: "Returns an array of users' profiles or error.",
  })
  @ApiBody({
    description: 'Set ids of users',
    type: GetUsersByIdsDto,
  })
  @ApiOkResponse({
    description: 'Users fetched successfully by ids',
    type: [UserProfileInfoDto],
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiNotFoundResponse({ description: "User doesn't exist", type: ErrorDto })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong when getting users by ids',
    type: ErrorDto,
  })
  @UseGuards(AccessTokenGuard)
  @Get('/get-by-ids')
  getUsersByIds(
    @Body() getUsersByIdsDto: GetUsersByIdsDto,
  ): Promise<UserProfileInfoDto[] | ErrorDto> {
    return this.userService.getByIds(getUsersByIdsDto.ids);
  }

  @ApiOperation({
    summary: 'Searching users who contain name string',
    description: "Returns an array of users' profiles or error.",
  })
  @ApiQuery({
    name: 'name',
    description: 'Set string for searching users',
    required: true,
    type: String,
  })
  @ApiOkResponse({
    description: 'Users who contain name string',
    type: [UserProfileInfoDto],
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiNotFoundResponse({ description: "User doesn't exist", type: ErrorDto })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong when searching users by name',
    type: ErrorDto,
  })
  @UseGuards(AccessTokenGuard)
  @Get('/search')
  searchUser(
    @Query('name') name: string,
  ): Promise<UserProfileInfoDto[] | ErrorDto> {
    return this.userService.search(name);
  }

  @ApiOperation({
    summary: 'Find user by id',
    description: "Returns a user's profile info or error.",
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the user',
    type: 'string',
    required: true,
  })
  @ApiOkResponse({
    description: 'User fetched successfully',
    type: UserProfileInfoDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiNotFoundResponse({ description: "User doesn't exist", type: ErrorDto })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong when getting a user by id',
    type: ErrorDto,
  })
  @UseGuards(AccessTokenGuard)
  @Get('/:id')
  getUserById(
    @Param('id') userId: string,
  ): Promise<UserProfileInfoDto | ErrorDto> {
    return this.userService.getById(userId);
  }
}
