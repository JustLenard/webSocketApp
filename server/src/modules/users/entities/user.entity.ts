import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
