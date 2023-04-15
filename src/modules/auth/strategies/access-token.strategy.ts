import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CustomConfigService } from '../../../config/customConfig.service';
import { AccessTokenOutputDto } from '../../../../utills/access-token-output.dto';
import {
  IUserRepository,
  UserRepository,
} from '../../user/repository/user.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: IUserRepository,
    private readonly configService: CustomConfigService,
  ) {
    const tokenConfig = configService.getAccessTokenConfig();

    super({
      secretOrKey: configService.getAccessTokenPublicKey(),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: tokenConfig.aud,
      issuer: tokenConfig.iss,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any): Promise<AccessTokenOutputDto> {
    const user = await this.userRepository.findOneById(payload.sub.id);

    if (!user) {
      throw new UnauthorizedException();
    }

    return payload.sub;
  }
}
