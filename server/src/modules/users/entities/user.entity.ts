import { Global } from '@nestjs/common'
import { JoinedRoomEntity } from 'src/modules/chat/entities/joinedRoom.entity'
import { MessageEntity } from 'src/modules/chat/entities/message.entity'
import { RoomEntity } from 'src/modules/chat/entities/room.entity'
import { BaseEntity, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Global()
@Entity('Users')
export class UserEntity extends BaseEntity {
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

	@Column({
		nullable: true,
	})
	isAdmin: boolean

	@ManyToMany(() => RoomEntity, (room) => room.users)
	rooms: RoomEntity[]
	// rooms: number[]

	@Column({
		type: 'varchar',
		nullable: true,
	})
	refreshToken: string | null

	@OneToMany(() => MessageEntity, (message) => message.user)
	messages: MessageEntity[]

	@OneToMany(() => JoinedRoomEntity, (joinedRoom) => joinedRoom.room)
	joinedRooms: JoinedRoomEntity[]
}
