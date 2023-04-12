import {
  Body,
  Controller,
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
import { FriendsRequestDto } from './dto';
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
    type: FriendsRequestDto,
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
    @Body() friendsRequestDto: FriendsRequestDto,
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
}
