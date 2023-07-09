import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { UserEntity } from '../../users/entities/user.entity'
import { RoomEntity } from './room.entity'

@Entity('JoinedRooms')
export class JoinedRoomEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	socketId: string

	@ManyToOne(() => UserEntity, (user) => user.joinedRooms)
	@JoinColumn({ name: 'JoinedRoom-Users' })
	user: UserEntity

	@ManyToOne(() => RoomEntity, (room) => room.joinedUsers)
	@JoinColumn()
	room: RoomEntity
}
