import { Global } from '@nestjs/common'
import { BaseEntity, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { RoomEntity } from './room.entity'
import { MessageEntity } from './message.entity'
import { JoinedRoomEntity } from './joinedRoom.entity'
import { NotificationsEntity } from './notifications.entity'

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
	notifications: NotificationsEntity[]

	@ManyToMany(() => NotificationsEntity, (notif) => notif.readBy)
	readNotifications: NotificationsEntity[]

	@OneToMany(() => NotificationsEntity, (notif) => notif.creator)
	createNotifications: NotificationsEntity[]
}
