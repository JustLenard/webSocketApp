import {
	CreateDateColumn,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import { UserEntity } from 'src/utils/entities/user.entity'
import { MessageEntity } from './message.entity'
import { RoomEntity } from './room.entity'

@Entity('Notifications')
export class NotificationsEntity {
	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(() => UserEntity, (user) => user.createdNotifications, { createForeignKeyConstraints: false })
	@JoinColumn()
	creator: UserEntity

	@OneToOne(() => MessageEntity, { createForeignKeyConstraints: false })
	@JoinColumn()
	message: MessageEntity

	@ManyToMany(() => UserEntity, (user) => user.readNotifications)
	@JoinTable()
	readBy: UserEntity[]

	@ManyToMany(() => UserEntity, (user) => user.readNotifications)
	@JoinTable()
	createdFor: UserEntity[]

	@ManyToOne(() => RoomEntity, (room) => room.notifications)
	@JoinColumn()
	room: RoomEntity

	@CreateDateColumn()
	created_at: Date

	@UpdateDateColumn()
	updated_at: Date
}
