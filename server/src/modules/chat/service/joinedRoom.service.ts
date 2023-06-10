import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from 'src/modules/users/entities/user.entity'
import { Repository } from 'typeorm'
import { JoinedRoomEntity } from '../entities/joinedRoom.entity'
import { RoomEntity } from '../entities/room.entity'
import { JoinedRoomI } from 'src/types/entities.types'

@Injectable()
export class JoinedRoomService {
	constructor(
		@InjectRepository(JoinedRoomEntity)
		private readonly joinedRoomRepository: Repository<JoinedRoomEntity>,
	) {}

	async create(joinedRoom: JoinedRoomI): Promise<JoinedRoomI> {
		return this.joinedRoomRepository.save(joinedRoom)
	}

	async findByUser(user: UserEntity): Promise<JoinedRoomEntity[]> {
		return this.joinedRoomRepository.find({
			where: {
				id: user.id,
			},
		})
	}

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
