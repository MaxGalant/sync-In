import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { MediaRepository } from './repository/media.repository';
import { DaysRepository } from '../days/repository/day.repository';

@Module({
  providers: [MediaService, MediaRepository, DaysRepository],
  controllers: [MediaController],
})
export class MediaModule {}
