import { Injectable, Logger } from '@nestjs/common';
import { Cron, Timeout } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EventsRepository,
  IEventsRepository,
} from '../events/repository/event.repository';
import {
  IWeeksRepository,
  WeeksRepository,
} from '../weeks/repository/weeks.repository';
import { WeekStatusEnum } from '../weeks/entity';
import {
  DaysRepository,
  IDaysRepository,
} from '../days/repository/day.repository';

@Injectable()
export class CronsService {
  private readonly logger = new Logger('Crons Service');

  constructor(
    @InjectRepository(EventsRepository)
    private readonly eventsRepository: IEventsRepository,
    @InjectRepository(WeeksRepository)
    private readonly weeksRepository: IWeeksRepository,
    @InjectRepository(DaysRepository)
    private readonly daysRepository: IDaysRepository,
  ) {}

  @Cron('0 * * * *')
  async createEvent() {
    const date = new Date();

    const event = await this.eventsRepository.findOneByDateMoreThan(date);

    if (!event) {
      date.setHours(date.getHours() + 3);

      const saveEventData = { started_at: date };

      await this.eventsRepository.saveEvent(saveEventData);
    }
  }

  @Cron('*/10 1-2 * * 1')
  async setTaskToDays() {
    const weeks = await this.weeksRepository.findManyInPendingStatus();

    const result = weeks.map(async (week) => {
      const tasks = week.tasks;

      if (!tasks.length) {
        await this.weeksRepository.updateStatus(
          week.id,
          WeekStatusEnum.FINISHED,
        );

        return;
      }

      const numRandoms = tasks.length >= 6 ? 6 : tasks.length;

      const weekDays = [];

      while (weekDays.length < numRandoms) {
        const randomNumber = Math.floor(Math.random() * 6) + 1;

        if (!weekDays.includes(randomNumber)) {
          weekDays.push(randomNumber);
        }
      }

      const tasksIndexes = [];

      while (tasksIndexes.length < numRandoms) {
        const randomIndex = Math.floor(Math.random() * tasks.length);

        if (!tasksIndexes.includes(randomIndex)) {
          tasksIndexes.push(randomIndex);
        }
      }

      const days = Array.from({ length: numRandoms }).map((taskItem, index) => {
        return {
          number: weekDays[index],
          task: tasks[tasksIndexes[index]],
          week,
        };
      });

      console.log(days);

      await this.daysRepository.saveDays(days);

      await this.weeksRepository.updateStatus(
        week.id,
        WeekStatusEnum.INPROGRESS,
      );
    });

    await Promise.all(result);
  }

  // @Cron('*/10 * * * *')
  @Timeout(0)
  async setEventToDays() {
    const date = new Date();

    const event = await this.eventsRepository.findOneByDateLessThan(date);

    if (!event) {
      return;
    }

    const days = await this.daysRepository.findManyByDayAndIfEventNull(
      date.getDay(),
    );

    const daysIds = days.map((day) => day.id);

    if (days.length) {
      await this.daysRepository.updateDays(daysIds, { event });

      await this.eventsRepository.updateState(event.id);
    }

    return;
  }
}
