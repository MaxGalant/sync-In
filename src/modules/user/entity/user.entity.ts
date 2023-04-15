import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Group } from '../../groups/entity/group.entity';

@Entity()
export class User {
  @ApiProperty()
  @PrimaryColumn()
  id: string;

  @ApiProperty()
  @Column()
  first_name: string;

  @ApiProperty()
  @Column()
  second_name: string;

  @ApiProperty()
  @Column({ nullable: true })
  image_url: string;

  @ApiProperty()
  @Column({ nullable: true })
  nickname: string;

  @Column({ default: false })
  active: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => `CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Kiev'`,
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => `CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Kiev'`,
  })
  updated_at: Date;

  @ManyToMany(() => Group)
  groups: Group[];
}
