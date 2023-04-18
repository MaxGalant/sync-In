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
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorDto, SuccessResponseDto } from '../../../utills';
import { AccessTokenGuard } from '../auth/gurds';
import { PayloadRequestInterface } from '../../../utills/interfaces/payload-request.interface';
import { AddUsersDto, CreateGroupDto } from './dto';
import { GroupsService } from './groups.service';

@ApiTags('Groups')
@Controller('group')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @ApiOperation({
    summary: 'Create a group',
    description: 'Returns group and an ok status or error',
  })
  @ApiBody({
    description: 'Set field for group creating',
    type: CreateGroupDto,
  })
  @ApiOkResponse({
    description: 'Group was successfully created',
    type: SuccessResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid token',
    type: ErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong while creating group',
    type: ErrorDto,
  })
  @UseGuards(AccessTokenGuard)
  @Post()
  createGroup(
    @Body() createGroupDto: CreateGroupDto,
    @Req() req: PayloadRequestInterface,
  ): Promise<SuccessResponseDto | ErrorDto> {
    const { user } = req;

    return this.groupsService.create(createGroupDto, user.id);
  }

  @ApiOperation({
    summary: 'Add user to a group',
    description: 'Returns message and an ok status or error',
  })
  @ApiBody({
    description: 'Set users ids',
    type: AddUsersDto,
  })
  @ApiOkResponse({
    description: 'Group request was successfully send to user',
    type: SuccessResponseDto,
  })
  @ApiNotFoundResponse({
    description: `Group doesn't exists`,
    type: SuccessResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid token',
    type: ErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: `Something went wrong while add user to group`,
    type: ErrorDto,
  })
  @UseGuards(AccessTokenGuard)
  @Post('users/:id')
  addUsersToGroup(
    @Body() addUsersDto: AddUsersDto,
    @Req() req: PayloadRequestInterface,
    @Param('id') groupId: string,
  ): Promise<SuccessResponseDto | ErrorDto> {
    const { user } = req;

    return this.groupsService.addUsers(addUsersDto.users, user.id, groupId);
  }

  @ApiOperation({
    summary: 'Get user groups',
    description: 'Returns groups and an ok status or error',
  })
  @ApiOkResponse({
    description: 'Groups was successfully fetched',
    type: SuccessResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid token',
    type: ErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: `Something went wrong while getting groups`,
    type: ErrorDto,
  })
  @UseGuards(AccessTokenGuard)
  @Get('')
  getGroups(
    @Req() req: PayloadRequestInterface,
  ): Promise<SuccessResponseDto | ErrorDto> {
    const { user } = req;

    return this.groupsService.getAll(user.id);
  }

  @ApiOperation({
    summary: "Get user's groups  requests",
    description: 'Returns requests and an ok status or error',
  })
  @ApiOkResponse({
    description: 'Groups requests was successfully fetched',
    type: SuccessResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid token',
    type: ErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: `Something went wrong while getting groups requests`,
    type: ErrorDto,
  })
  @UseGuards(AccessTokenGuard)
  @Get('request')
  getGroupsRequests(
    @Req() req: PayloadRequestInterface,
  ): Promise<SuccessResponseDto | ErrorDto> {
    const { user } = req;

    return this.groupsService.getRequests(user.id);
  }

  @ApiOperation({
    summary: 'Accepting user group request',
    description: 'Returns message and an ok status or error',
  })
  @ApiOkResponse({
    description: 'Group request was successfully accepted',
    type: SuccessResponseDto,
  })
  @ApiNotFoundResponse({
    description: `Group request doesn't exists`,
    type: SuccessResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid token',
    type: ErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: `Something went wrong while accepting group request`,
    type: ErrorDto,
  })
  @UseGuards(AccessTokenGuard)
  @Patch('request/accept/:request_id')
  acceptGroupRequest(
    @Param('request_id') requestId: string,
    @Req() req: PayloadRequestInterface,
  ): Promise<SuccessResponseDto | ErrorDto> {
    const { user } = req;

    return this.groupsService.acceptRequests(requestId, user.id);
  }

  @ApiOperation({
    summary: 'Decline user group request',
    description: 'Returns message and an ok status or error',
  })
  @ApiOkResponse({
    description: 'Group request was successfully declined',
    type: SuccessResponseDto,
  })
  @ApiNotFoundResponse({
    description: `Group request doesn't exists`,
    type: SuccessResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid token',
    type: ErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: `Something went wrong while declining group request`,
    type: ErrorDto,
  })
  @UseGuards(AccessTokenGuard)
  @Patch('request/decline/:request_id')
  declineGroupRequest(
    @Param('request_id') requestId: string,
    @Req() req: PayloadRequestInterface,
  ): Promise<SuccessResponseDto | ErrorDto> {
    const { user } = req;

    return this.groupsService.declineRequests(requestId, user.id);
  }

  @ApiOperation({
    summary: 'Get user group by id',
    description: 'Returns group and an ok status or error',
  })
  @ApiOkResponse({
    description: 'Groups was successfully fetched',
    type: SuccessResponseDto,
  })
  @ApiNotFoundResponse({
    description: `Group doesn't exists`,
    type: SuccessResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid token',
    type: ErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: `Something went wrong while getting group`,
    type: ErrorDto,
  })
  @UseGuards(AccessTokenGuard)
  @Get('/:id')
  getGroupById(
    @Param('id') groupId: string,
    @Req() req: PayloadRequestInterface,
  ): Promise<SuccessResponseDto | ErrorDto> {
    const { user } = req;

    return this.groupsService.getById(groupId, user.id);
  }
}
