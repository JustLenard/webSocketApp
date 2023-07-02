import { Injectable, OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { RoomEntity } from '../entities/room.entity'
import { In, Repository } from 'typeorm'
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

	async getRoomsForUser(userId: number) {
		return this.roomRepository
			.createQueryBuilder('room')
			.leftJoin('room.users', 'users')
			.where('users.id = :userId', { userId: userId })
			.leftJoinAndSelect('room.users', 'all_users')
			.getMany()
	}

	async getRoom(roomId: number): Promise<RoomEntity> {
		return this.roomRepository.findOne({
			where: { id: roomId },
		})
	}

	async createRoom(room: RoomI, creator: UserI) {
		console.log('This is creator', creator)
		console.log('This is room', room)

		const newRoom = await this.addCreatorToRoom(room, creator.id)

		console.log('This is newRoom', newRoom)
		return this.roomRepository.save(newRoom)
	}

	async getRoomByName(roomName = 'Global'): Promise<RoomEntity> {
		return this.roomRepository.findOne({
			where: { name: roomName },
		})
	}

	async checkIfPrivateRoomExits(firstUserId: number, secondUserId: number) {
		const rooms = await this.getRoomsForUser(firstUserId)

		console.log('This is rooms', rooms)

		const privateRooms = rooms.filter((room) => !room.isGroupChat)
	}

	async addCreatorToRoom(room: RoomI, userId: number) {
		console.log('This is room.users', room.users)
		room.users.push(userId)
		return room
	}
}
