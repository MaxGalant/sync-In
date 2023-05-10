import { DataSource, DeleteResult, EntityManager, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { Media } from '../entity/media.entity';

export interface IMediaRepository {
  saveMedia(createData: any, manager: EntityManager): Promise<Media>;
  findOneByDay(dayId: string): Promise<Media>;
  findOneUserItem(id: string, userId: string): Promise<Media>;
  deleteOne(id: string): Promise<DeleteResult>;
}

@Injectable()
export class MediaRepository
  extends Repository<Media>
  implements IMediaRepository
{
  private logger = new Logger('Task Repository');

  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {
    super(Media, dataSource.createEntityManager());
  }

  async saveMedia(createData: any, manager: EntityManager): Promise<Media> {
    this.logger.log(`Saving media`);

    return manager.save(Media, { ...createData });
  }

  async findOneByDay(dayId: string): Promise<Media> {
    this.logger.log(`Find media by day`);

    return this.findOne({ where: { day: { id: dayId } } });
  }

  async findOneUserItem(id: string, userId: string): Promise<Media> {
    this.logger.log(`Find media`);

    return this.findOne({ where: { id, user: { id: userId } } });
  }

  async deleteOne(id: string): Promise<DeleteResult> {
    this.logger.log(`Delete media`);

    return this.delete(id);
  }
}
