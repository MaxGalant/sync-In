import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CustomConfigService } from '../../../config/customConfig.service';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
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

  async validate(payload: any): Promise<any> {

  return payload
  }
}
