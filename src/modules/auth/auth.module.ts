import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AccessTokenStrategy } from './strategies';
import { CustomConfigModule } from '../../config/customConfig.module';
import { UserRepository } from '../user/repository/user.repository';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
    CustomConfigModule,
  ],
  controllers: [],
  providers: [AccessTokenStrategy, UserRepository],
})
export class AuthModule {}
