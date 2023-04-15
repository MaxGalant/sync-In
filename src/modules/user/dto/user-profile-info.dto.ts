import { User } from '../entity';
import { Exclude } from 'class-transformer';

export class UserProfileInfoDto extends User {
  @Exclude()
  active: boolean;

  @Exclude()
  created_at: Date;

  @Exclude()
  updated_at: Date;
}
