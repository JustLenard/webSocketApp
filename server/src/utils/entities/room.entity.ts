import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { MessageEntity } from './message.entity'
import { UserEntity } from 'src/utils/entities/user.entity'
import { JoinedRoomEntity } from './joinedRoom.entity'
import { NotificationsEntity } from './notifications.entity'

@Entity('Rooms')
export class RoomEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ nullable: true })
	name: string

	@Column({ nullable: true })
	description: string

	@ManyToMany(() => UserEntity)
	@JoinTable({ name: 'Users_Rooms_Map' })
	users: UserEntity[]

	@OneToMany(() => MessageEntity, (message) => message.room)
	messages: MessageEntity[]

	@OneToOne(() => MessageEntity, { nullable: true })
	@JoinColumn({ name: 'Last_Message_Sent' })
	lastMessage: MessageEntity

	@OneToMany(() => JoinedRoomEntity, (joinedRoom) => joinedRoom.room)
	joinedUsers: JoinedRoomEntity[]

	@Column()
	isGroupChat: boolean

	@OneToMany(() => MessageEntity, (notif) => notif.room)
	notifications: NotificationsEntity[]
}
