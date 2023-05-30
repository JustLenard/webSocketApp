import { Global } from '@nestjs/common';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Global()
@Entity('Users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({
    comment: 'User uuid',
  })
  id: number;

  @Column({
    type: 'varchar',
    unique: true,
  })
  username: string;

  @Column({
    type: 'varchar',
  })
  password: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  refreshToken: string | null;
}
