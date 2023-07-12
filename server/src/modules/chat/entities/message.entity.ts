import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import { UserEntity } from 'src/modules/users/entities/user.entity'
import { RoomEntity } from './room.entity'
import { NotificationsEntity } from './notifications.entity'

@Entity('Messages')
export class MessageEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	text: string

	@ManyToOne(() => UserEntity, (user) => user.messages)
	@JoinColumn()
	user: UserEntity

	@ManyToOne(() => RoomEntity, (room) => room.messages)
	@JoinTable()
	room: RoomEntity

	@CreateDateColumn()
	created_at: Date

	@UpdateDateColumn()
	updated_at: Date

	// read_by: number[]
}
