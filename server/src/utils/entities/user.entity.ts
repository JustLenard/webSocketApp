import { Global } from '@nestjs/common'
import { BaseEntity, Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { RoomEntity } from './room.entity'
import { MessageEntity } from './message.entity'
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

	@ManyToMany(() => NotificationsEntity, (notif) => notif.readBy)
	readNotifications: NotificationsEntity[]

	@ManyToMany(() => NotificationsEntity, (notif) => notif.createdFor)
	unreadNotifications: NotificationsEntity[]

	@OneToMany(() => NotificationsEntity, (notif) => notif.creator)
	createdNotifications: NotificationsEntity[]
}
