import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AccessTokenStrategy } from './strategies';
import { CustomConfigModule } from '../../config/customConfig.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
    CustomConfigModule,
  ],
  controllers: [],
  providers: [AccessTokenStrategy],
})
export class AuthModule {}
