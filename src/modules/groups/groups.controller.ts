import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorDto, SuccessResponseDto } from '../../../utills';
import { AccessTokenGuard } from '../auth/gurds';
import { PayloadRequestInterface } from '../../../utills/interfaces/payload-request.interface';
import { CreateGroupDto } from './dto';
import { GroupsService } from './group.service';

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
}
