import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomConfigModule } from './config/customConfig.module';
import { CustomConfigService } from './config/customConfig.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([]),
    TypeOrmModule.forRootAsync({
      imports: [CustomConfigModule],
      inject: [CustomConfigService],
      useFactory: async (configService: CustomConfigService) => {
        return configService.getTypeOrmConfig();
      },
    }),
   ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
