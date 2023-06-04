import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { RoomEntity } from '../../entities/room.entity'
import { Repository } from 'typeorm'
import { User } from 'src/modules/users/entities/user.entity'

@Injectable()
export class RoomService {
	constructor(
		@InjectRepository(RoomEntity)
		private readonly roomRepository: Repository<RoomEntity>,
	) {}

	async createRoom(room: RoomEntity, creator: User) {
		console.log('This is creator', creator)

		console.log('This is room', room)
		const newRoom = await this.addCreatorToRoom(room, creator)

		console.log('This is newRoom', newRoom)
		return this.roomRepository.save(newRoom)
	}

	async getRoomsForUser(userId: number) {
		return this.roomRepository
			.createQueryBuilder('room')
			.leftJoin('room.users', 'users')
			.where('users.id = :userId', { userId: userId })
			.leftJoinAndSelect('room.users', 'all_users')
			.getMany()
	}

	async addCreatorToRoom(room: RoomEntity, creator: User) {
		room.users.push(creator)
		return room
	}
}
