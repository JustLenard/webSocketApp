import { UserEntity } from 'src/modules/users/entities/user.entity'
import {
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToMany,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import { MessageEntity } from './message.entity'
import { RoomEntity } from './room.entity'

@Entity('Notifications')
export class NotificationsEntity {
	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(() => UserEntity, (user) => user.createNotifications)
	creator: UserEntity

	@OneToOne(() => MessageEntity)
	@JoinColumn()
	message: MessageEntity

	@ManyToMany(() => UserEntity, (user) => user.notifications)
	// @JoinColumn()
	createdFor: UserEntity[]

	@ManyToMany(() => UserEntity, (user) => user.readNotifications)
	readBy: UserEntity[]

	@ManyToOne(() => RoomEntity, (room) => room.notifications)
	// @JoinColumn()
	room: RoomEntity

	@CreateDateColumn()
	created_at: Date

	@UpdateDateColumn()
	updated_at: Date
}
