import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FriendsService } from './friends.service';
import { AccessTokenGuard } from '../auth/gurds';
import { InputFriendDto } from './dto';
import { ErrorDto, SuccessResponseDto } from '../../../utills';
import { PayloadRequestInterface } from '../../../utills/interfaces/payload-request.interface';

@ApiTags('Friends')
@Controller('friend')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @ApiOperation({
    summary: 'Send a friend request',
    description: 'Returns string and an ok status or error',
  })
  @ApiBody({
    description: "Set friend's id",
    type: InputFriendDto,
  })
  @ApiOkResponse({
    description: 'Friend request was successfully sent',
    type: SuccessResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid token',
    type: ErrorDto,
  })
  @ApiConflictResponse({
    description: 'You already have sent request',
    type: ErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description:
      'Something went wrong while sending friend request to user with id',
    type: ErrorDto,
  })
  @UseGuards(AccessTokenGuard)
  @Post('request')
  sendFriendRequest(
    @Body() friendsRequestDto: InputFriendDto,
    @Req() req: PayloadRequestInterface,
  ): Promise<SuccessResponseDto | ErrorDto> {
    const { user } = req;

    return this.friendsService.sendRequest(friendsRequestDto.friendId, user.id);
  }

  @ApiOperation({
    summary: 'Accept a friend request',
    description: 'Returns string and an ok status or error',
  })
  @ApiOkResponse({
    description: 'Request was successfully accepted',
    type: SuccessResponseDto,
  })
  @ApiNotFoundResponse({
    description: "The request doesn't exist",
    type: ErrorDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid token',
    type: ErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description:
      'Something went wrong while accepting the friend request with id',
    type: ErrorDto,
  })
  @UseGuards(AccessTokenGuard)
  @Patch('accept/:request_id')
  acceptFriendRequest(
    @Param('request_id') requestId: string,
    @Req() req: PayloadRequestInterface,
  ): Promise<SuccessResponseDto | ErrorDto> {
    const { user } = req;

    return this.friendsService.acceptRequest(requestId, user.id);
  }

  @ApiOperation({
    summary: 'Decline a friend request',
    description: 'Returns string and an ok status or error',
  })
  @ApiOkResponse({
    description: 'Request was successfully declined',
    type: SuccessResponseDto,
  })
  @ApiNotFoundResponse({
    description: "The request doesn't exist",
    type: ErrorDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid token',
    type: ErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description:
      'Something went wrong while declining the friend request with id',
    type: ErrorDto,
  })
  @UseGuards(AccessTokenGuard)
  @Patch('decline/:request_id')
  declineFriendRequest(
    @Param('request_id') requestId: string,
    @Req() req: PayloadRequestInterface,
  ): Promise<SuccessResponseDto | ErrorDto> {
    const { user } = req;

    return this.friendsService.declineRequest(requestId, user.id);
  }

  @ApiOperation({
    summary: 'Delete a friend',
    description: 'Returns string and an ok status or error',
  })
  @ApiBody({
    description: "Set friend's id",
    type: InputFriendDto,
  })
  @ApiOkResponse({
    description: 'Friend was successfully deleted',
    type: SuccessResponseDto,
  })
  @ApiNotFoundResponse({
    description: "You don't have friend",
    type: ErrorDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid token',
    type: ErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong while deleting the friend with id',
    type: ErrorDto,
  })
  @UseGuards(AccessTokenGuard)
  @Patch('delete')
  deleteFriend(
    @Req() req: PayloadRequestInterface,
    @Body() friendDto: InputFriendDto,
  ): Promise<SuccessResponseDto | ErrorDto> {
    const { user } = req;

    return this.friendsService.deleteFriend(friendDto.friendId, user.id);
  }

  @ApiOperation({
    summary: 'Block a user',
    description: 'Returns string and an ok status or error',
  })
  @ApiBody({
    description: "Set friend's id",
    type: InputFriendDto,
  })
  @ApiOkResponse({
    description: 'User was successfully deleted',
    type: SuccessResponseDto,
  })
  @ApiConflictResponse({
    description: 'User already is blocked',
    type: ErrorDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid token',
    type: ErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong while blocking the user with id',
    type: ErrorDto,
  })
  @UseGuards(AccessTokenGuard)
  @Patch('block')
  blockFriend(
    @Req() req: PayloadRequestInterface,
    @Body() friendDto: InputFriendDto,
  ): Promise<SuccessResponseDto | ErrorDto> {
    const { user } = req;

    return this.friendsService.blockFriend(friendDto.friendId, user.id);
  }

  @ApiOperation({
    summary: 'Unblock a user',
    description: 'Returns string and an ok status or error',
  })
  @ApiBody({
    description: "Set friend's id",
    type: InputFriendDto,
  })
  @ApiOkResponse({
    description: 'User was successfully unblocked',
    type: SuccessResponseDto,
  })
  @ApiNotFoundResponse({
    description: "You don't have a blocked user",
    type: ErrorDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid token',
    type: ErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong while blocking the user with id',
    type: ErrorDto,
  })
  @UseGuards(AccessTokenGuard)
  @Patch('unblock')
  unBlockFriend(
    @Req() req: PayloadRequestInterface,
    @Body() friendDto: InputFriendDto,
  ): Promise<SuccessResponseDto | ErrorDto> {
    const { user } = req;

    return this.friendsService.unblockFriend(friendDto.friendId, user.id);
  }

  @ApiOperation({
    summary: "Get a user's requests",
    description: 'Returns requests and an ok status or error',
  })
  @ApiOkResponse({
    description: "User's requests was successfully fetching",
    type: SuccessResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid token',
    type: ErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: "Something went wrong while fetching user's requests",
    type: ErrorDto,
  })
  @UseGuards(AccessTokenGuard)
  @Get('request')
  getUserRequests(
    @Req() req: PayloadRequestInterface,
  ): Promise<SuccessResponseDto | ErrorDto> {
    const { user } = req;

    return this.friendsService.getFriendRequests(user.id);
  }

  @ApiOperation({
    summary: "Get a user's friends",
    description: 'Returns friends and an ok status or error',
  })
  @ApiOkResponse({
    description: "User's friends was successfully fetching",
    type: SuccessResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid token',
    type: ErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: "Something went wrong while friends user's requests",
    type: ErrorDto,
  })
  @UseGuards(AccessTokenGuard)
  @Get('friends')
  getUserFriends(
    @Req() req: PayloadRequestInterface,
  ): Promise<SuccessResponseDto | ErrorDto> {
    const { user } = req;

    return this.friendsService.getFriends(user.id);
  }
}
