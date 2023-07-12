import { Global } from '@nestjs/common'
import { JoinedRoomEntity } from 'src/modules/chat/entities/joinedRoom.entity'
import { MessageEntity } from 'src/modules/chat/entities/message.entity'
import { NotificationsEntity } from 'src/modules/chat/entities/notifications.entity'
import { RoomEntity } from 'src/modules/chat/entities/room.entity'
import { BaseEntity, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

export enum AccountType {
	default = 'default',
	admin = 'admin',
	guest = 'guest',
	bot = 'bot',
}

@Global()
@Entity('Users')
export class UserEntity extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column({
		type: 'varchar',
		unique: true,
	})
	username: string

	@Column({
		type: 'varchar',
	})
	password: string

	@Column({ type: 'enum', enum: AccountType, default: AccountType.default })
	accountType: AccountType

	@Column({
		nullable: true,
	})
	socketId: string

	@ManyToMany(() => RoomEntity, (room) => room.users)
	rooms: RoomEntity[]

	@Column({
		type: 'varchar',
		nullable: true,
	})
	refreshToken: string | null

	@OneToMany(() => MessageEntity, (message) => message.user)
	messages: MessageEntity[]

	@OneToMany(() => JoinedRoomEntity, (joinedRoom) => joinedRoom.room)
	joinedRooms: JoinedRoomEntity[]

	@ManyToMany(() => NotificationsEntity, (notif) => notif.createdFor)
	notifications: NotificationsEntity
}
