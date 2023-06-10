import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { RoomEntity } from '../entities/room.entity'
import { Repository } from 'typeorm'
import { RoomI, UserI } from 'src/types/entities.types'

@Injectable()
export class RoomService {
	constructor(
		@InjectRepository(RoomEntity)
		private readonly roomRepository: Repository<RoomEntity>,
	) {}

	async createRoom(room: RoomI, creator: UserI) {
		console.log('This is creator', creator)

		console.log('This is room', room)
		const newRoom = await this.addCreatorToRoom(room, creator)

		console.log('This is newRoom', newRoom)
		return this.roomRepository.save(newRoom)
	}

	async getRoom(roomId: number): Promise<RoomEntity> {
		return this.roomRepository.findOne({
			where: { id: roomId },
		})
	}

	async getRoomsForUser(userId: number) {
		return this.roomRepository
			.createQueryBuilder('room')
			.leftJoin('room.users', 'users')
			.where('users.id = :userId', { userId: userId })
			.leftJoinAndSelect('room.users', 'all_users')
			.getMany()
	}

	async addCreatorToRoom(room: RoomI, creator: UserI) {
		console.log('This is room.users', room.users)
		room.users.push(creator)
		return room
	}
}
