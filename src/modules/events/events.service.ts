import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EventsRepository,
  IEventsRepository,
} from './repository/event.repository';
import { ErrorDto, SuccessResponseDto } from '../../../utills';
import { DataSource } from 'typeorm';

@Injectable()
export class EventsService {
  private readonly logger = new Logger('Events Service');

  constructor(
    @InjectRepository(EventsRepository)
    private readonly eventsRepository: IEventsRepository,
    private readonly dataSource: DataSource,
  ) {}

  async create(): Promise<SuccessResponseDto | ErrorDto> {
    this.logger.log('Creating a new event');

    const queryRunner = this.dataSource.createQueryRunner();

    const { manager } = queryRunner;

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const currentDate = new Date();

      currentDate.setHours(currentDate.getHours() + 1);

      // const createData = { started_at: currentDate };

      // const event = await this.eventsRepository.saveEvent(createData, manager);

      return {
        statusCode: 200,
        message: 'Event was successfully created',
        data: event,
      };
    } catch (error) {
      this.logger.error(
        `Something went wrong while creating event`,
        error?.stack,
      );

      return new ErrorDto(
        500,
        'Server error',
        `Something went wrong while creating event`,
      );
    }
  }
}
