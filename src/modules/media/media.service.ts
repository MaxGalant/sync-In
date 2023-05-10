import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IMediaRepository,
  MediaRepository,
} from './repository/media.repository';
import { ErrorDto, SuccessResponseDto } from '../../../utills';
import { DataSource } from 'typeorm';
import { CreateMediaDto } from './dto/create-media.dto';
import {
  DaysRepository,
  IDaysRepository,
} from '../days/repository/day.repository';

@Injectable()
export class MediaService {
  private logger = new Logger('Media Service');

  constructor(
    @InjectRepository(DaysRepository)
    private readonly daysRepository: IDaysRepository,
    @InjectRepository(MediaRepository)
    private readonly mediaRepository: IMediaRepository,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    userId: string,
    createMediaDto: CreateMediaDto,
  ): Promise<SuccessResponseDto | ErrorDto> {
    this.logger.log(`Create media`);

    const queryRunner = this.dataSource.createQueryRunner();

    const { manager } = queryRunner;

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const day = await this.daysRepository.findOneDay(createMediaDto.day);

      if (!day) {
        return new ErrorDto(404, 'Not Found', `Day doesn't exist`);
      }

      const media = await this.mediaRepository.findOneByDay(createMediaDto.day);

      if (media) {
        return new ErrorDto(
          409,
          'Conflict',
          `You have already added media for that day `,
        );
      }

      const createObject = {
        imageUrl: createMediaDto.imageUrl,
        day: createMediaDto.day,
        user: userId,
      };

      const newMedia = await this.mediaRepository.saveMedia(
        createObject,
        manager,
      );

      await queryRunner.commitTransaction();

      return {
        statusCode: 200,
        message: 'Media was successfully created',
        data: newMedia,
      };
    } catch (error) {
      this.logger.error(
        `Something went wrong while creating media`,
        error?.stack,
      );

      await queryRunner.rollbackTransaction();

      return new ErrorDto(
        500,
        'Server error',
        `Something went wrong while creating media`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async remove(
    userId: string,
    id: string,
  ): Promise<SuccessResponseDto | ErrorDto> {
    this.logger.log(`Delete media`);

    try {
      const media = await this.mediaRepository.findOneUserItem(id, userId);

      if (!media) {
        return new ErrorDto(404, 'Not Found', `Media doesn't exist`);
      }

      await this.mediaRepository.deleteOne(id);

      return {
        statusCode: 200,
        message: 'Media was successfully deleted',
        data: {},
      };
    } catch (error) {
      this.logger.error(
        `Something went wrong while deleting media`,
        error?.stack,
      );

      return new ErrorDto(
        500,
        'Server error',
        `Something went wrong while deleting media`,
      );
    }
  }
}
