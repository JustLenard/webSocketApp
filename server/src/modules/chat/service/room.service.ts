import { Injectable, OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { RoomEntity } from '../entities/room.entity'
import { Repository } from 'typeorm'
import { RoomI, UserI } from 'src/types/entities.types'

@Injectable()
export class RoomService implements OnModuleInit {
	async onModuleInit() {
		console.log(`The module has been initialized.`)
		const globalRoom = await this.getRoomByName()

		if (!globalRoom) {
			console.log('creating global Room')
			this.roomRepository.save({
				name: 'Global',
			})
		}
	}

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

	async getRoomByName(roomName = 'Global'): Promise<RoomEntity> {
		return this.roomRepository.findOne({
			where: { name: roomName },
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
