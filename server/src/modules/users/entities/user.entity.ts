import { Global } from '@nestjs/common'
import { RoomEntity } from 'src/modules/chat/entities/room.entity'
import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'

@Global()
@Entity('Users')
export class User extends BaseEntity {
	@PrimaryGeneratedColumn({
		comment: 'User uuid',
	})
	id: number

	@Column({
		type: 'varchar',
		unique: true,
	})
	username: string

	@Column({
		type: 'varchar',
	})
	password: string

	@ManyToMany(() => RoomEntity, (room) => room.users)
	rooms: RoomEntity[]

	@Column({
		type: 'varchar',
		nullable: true,
	})
	refreshToken: string | null
}
