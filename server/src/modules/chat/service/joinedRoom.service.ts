import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { RoomEntity } from '../../../utils/entities/room.entity'
import { JoinedRoomI } from 'src/utils/types/entities.types'
import { JoinedRoomEntity } from 'src/utils/entities/joinedRoom.entity'

@Injectable()
export class JoinedRoomService {
	constructor(
		@InjectRepository(JoinedRoomEntity)
		private readonly joinedRoomRepository: Repository<JoinedRoomEntity>,
	) {}

	async create(joinedRoom: JoinedRoomI): Promise<JoinedRoomI> {
		return this.joinedRoomRepository.save(joinedRoom)
	}

	// async findByUser(user: UserEntity): Promise<JoinedRoomEntity[]> {
	// 	return this.joinedRoomRepository.find({
	// 		where: {
	// 			id: user.id,
	// 		},
	// 	})
	// }

	async findByRoom(room: RoomEntity): Promise<JoinedRoomEntity[]> {
		return this.joinedRoomRepository.find({
			where: {
				id: room.id,
			},
		})
	}

	async deleteBySocketId(socketId: string) {
		return this.joinedRoomRepository.delete({ socketId })
	}

	async deleteAll() {
		await this.joinedRoomRepository.createQueryBuilder().delete().execute()
	}
}
