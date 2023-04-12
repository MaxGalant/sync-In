import { AccessTokenOutputDto } from '../access-token-output.dto';

export interface PayloadRequestInterface extends Request {
  user: AccessTokenOutputDto;
}
