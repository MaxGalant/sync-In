import {
  Body,
  Controller,
  Delete,
  Param,
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
import { MediaService } from './media.service';
import { ErrorDto, SuccessResponseDto } from '../../../utills';
import { CreateMediaDto } from './dto/create-media.dto';
import { PayloadRequestInterface } from '../../../utills/interfaces/payload-request.interface';
import { AccessTokenGuard } from '../auth/gurds';

@ApiTags('Media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @ApiOperation({
    summary: 'Add media to a day',
    description: 'Returns message and an ok status or error',
  })
  @ApiBody({
    description: 'Set dayId and media path',
    type: CreateMediaDto,
  })
  @ApiOkResponse({
    description: 'Media was successfully created',
    type: SuccessResponseDto,
  })
  @ApiConflictResponse({
    description: `You have already added media for that day`,
    type: ErrorDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid token',
    type: ErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: `Something went wrong while add media`,
    type: ErrorDto,
  })
  @UseGuards(AccessTokenGuard)
  @Post('add')
  async addMedia(
    @Req() req: PayloadRequestInterface,
    @Body() createMediaDto: CreateMediaDto,
  ): Promise<SuccessResponseDto | ErrorDto> {
    const { user } = req;
    return this.mediaService.create(user.id, createMediaDto);
  }

  @ApiOperation({
    summary: 'Delete media',
    description: 'Returns message and an ok status or error',
  })
  @ApiOkResponse({
    description: 'Media was successfully deleted',
    type: SuccessResponseDto,
  })
  @ApiNotFoundResponse({
    description: `Media doesn't exists`,
    type: ErrorDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid token',
    type: ErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: `Something went wrong while deleting user media`,
    type: ErrorDto,
  })
  @UseGuards(AccessTokenGuard)
  @Delete('/:id')
  async deleteMedia(
    @Param('id') mediaId: string,
    @Req() req: PayloadRequestInterface,
  ): Promise<SuccessResponseDto | ErrorDto> {
    const { user } = req;

    return this.mediaService.remove(user.id, mediaId);
  }
}
