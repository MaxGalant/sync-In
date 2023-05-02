import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import {
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateGroupDto } from '../groups/dto';
import { ErrorDto, SuccessResponseDto } from '../../../utills';
import { AccessTokenGuard } from '../auth/gurds';
import { PayloadRequestInterface } from '../../../utills/interfaces/payload-request.interface';
import { CreateTaskDto } from './dto';
import { UpdateTaskDto } from './dto';
import { GetTaskDto } from './dto/get-task.dto';

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOperation({
    summary: 'Create a group task',
    description: 'Returns task and an ok status or error',
  })
  @ApiBody({
    description: 'Set text and group id for group creating',
    type: CreateGroupDto,
  })
  @ApiOkResponse({
    description: 'Task was successfully created',
    type: SuccessResponseDto,
  })
  @ApiNotFoundResponse({
    description: "Group doesn't exist",
    type: ErrorDto,
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
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: PayloadRequestInterface,
  ): Promise<SuccessResponseDto | ErrorDto> {
    const { user } = req;

    return this.tasksService.create(createTaskDto, user.id);
  }

  @ApiOperation({
    summary: 'Update a group task',
    description: 'Returns message and an ok status or error',
  })
  @ApiBody({
    description: 'Set text ',
    type: UpdateTaskDto,
  })
  @ApiOkResponse({
    description: 'Task was successfully created',
    type: SuccessResponseDto,
  })
  @ApiNotFoundResponse({
    description: "Task doesn't exist",
    type: ErrorDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid token',
    type: ErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong while updating group',
    type: ErrorDto,
  })
  @UseGuards(AccessTokenGuard)
  @Patch('/:id')
  updateTask(
    @Body() updateTaskDto: UpdateTaskDto,
    @Param('id') taskId: string,
    @Req() req: PayloadRequestInterface,
  ): Promise<SuccessResponseDto | ErrorDto> {
    const { user } = req;

    return this.tasksService.update(updateTaskDto.text, taskId, user.id);
  }

  @ApiOperation({
    summary: 'Update a group task',
    description: 'Returns message and an ok status or error',
  })
  @ApiBody({
    description: 'Set text ',
    type: UpdateTaskDto,
  })
  @ApiOkResponse({
    description: 'Task was deleted created',
    type: SuccessResponseDto,
  })
  @ApiNotFoundResponse({
    description: "Task doesn't exist",
    type: ErrorDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid token',
    type: ErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong while deleting group',
    type: ErrorDto,
  })
  @UseGuards(AccessTokenGuard)
  @Delete('/:id')
  deleteTask(
    @Param('id') taskId: string,
    @Req() req: PayloadRequestInterface,
  ): Promise<SuccessResponseDto | ErrorDto> {
    const { user } = req;

    return this.tasksService.delete(taskId, user.id);
  }

  @ApiOperation({
    summary: 'Update a group task',
    description: 'Returns message and an ok status or error',
  })
  @ApiBody({
    description: 'Set text ',
    type: UpdateTaskDto,
  })
  @ApiOkResponse({
    description: 'Task was deleted created',
    type: SuccessResponseDto,
  })
  @ApiNotFoundResponse({
    description: "Task doesn't exist",
    type: ErrorDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid token',
    type: ErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong while deleting group',
    type: ErrorDto,
  })
  @UseGuards(AccessTokenGuard)
  @Get()
  getUserTask(
    @Body() getTaskDto: GetTaskDto,
    @Req() req: PayloadRequestInterface,
  ): Promise<SuccessResponseDto | ErrorDto> {
    const { user } = req;

    return this.tasksService.getTask(getTaskDto.groupId, user.id);
  }
}
