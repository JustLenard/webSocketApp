import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { RoomEntity } from 'src/utils/entities/room.entity'
import { UserEntity } from 'src/utils/entities/user.entity'
import { RoomI } from 'src/utils/types/entities.types'
import { In, Repository } from 'typeorm'
import { CreateRoomDto } from './dto/create-room.dto'
import { CreateRoomParams } from 'src/utils/types/types'
import { MessageEntity } from 'src/utils/entities/message.entity'

@Injectable()
export class RoomsService implements OnModuleInit {
	async onModuleInit() {
		const globalRoom = await this.getRoomByName()

		const admin = await this.userRepository.findOne({
			where: {
				username: 'len',
			},
			// relations: ['rooms'],
		})

		if (!globalRoom) {
			this.logger.warn('Creating global Room')

			const globalRoom: RoomI = {
				name: 'Global',
				users: [admin],
				isGroupChat: true,
			}

			this.roomRepository.save(globalRoom)
		}
	}

	constructor(
		@InjectRepository(RoomEntity)
		private readonly roomRepository: Repository<RoomEntity>,

		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
	) {}

	private logger: Logger = new Logger('Room Service')

	async getRoomsForUser(userId: string) {
		return this.roomRepository
			.createQueryBuilder('room')
			.leftJoin('room.users', 'users')
			.where('users.id = :userId', { userId: userId })
			.leftJoinAndSelect('room.lastMessage', 'lastMessge')
			.leftJoin('room.users', 'allUsers')
			.select(['room', 'allUsers.id', 'allUsers.username', 'lastMessge'])
			.getMany()
	}

	async createRoom(room: CreateRoomParams, creator: UserEntity) {
		this.logger.debug('creating room')

		const newRoom = await this.addUsersToRoom({ ...room, users: [creator] }, room.users)
		console.log('This is newRoom', newRoom)
		return this.roomRepository.save(newRoom)
	}

	async findRoomById(roomId: number): Promise<RoomEntity> {
		return this.roomRepository
			.createQueryBuilder('room')
			.leftJoinAndSelect('room.users', 'users')
			.leftJoinAndSelect('room.lastMessage', 'lastMessage')
			.where('room.id = :id', { id: roomId })
			.getOne()
	}

	async getRoomByName(roomName = 'Global'): Promise<RoomEntity> {
		return this.roomRepository.findOne({
			where: { name: roomName },
		})
	}

	async privateChatExists(firstUserId: string, secondUserId: string): Promise<null | RoomEntity> {
		return this.roomRepository
			.createQueryBuilder('room')
			.leftJoin('room.users', 'users')
			.leftJoin('room.users', 'all_users')
			.where('users.id = :userId', { userId: firstUserId })
			.andWhere('room.isGroupChat = :isGroupChat', { isGroupChat: false })
			.andWhere('all_users.id = :secondUserId', { secondUserId: secondUserId })
			.getOne()
	}

	async checkIfPrivateChatExits(firstUserId: string, secondUserId: string): Promise<number | boolean> {
		const result = await this.privateChatExists(firstUserId, secondUserId)

		return result ? result.id : false
	}

	async userIsPartOfRoom(room: RoomI, userId: string) {
		return room.users.find((user) => user.id === userId)
	}

	async addLastMessageToRoom(room: RoomEntity, message: MessageEntity) {
		// room.lastMessage = message

		console.log('This is room', room)
		console.log('This is lastMessage', message)

		return this.roomRepository.update(room.id, { lastMessage: message })
		// return this.roomRepository.save(room)
	}

	async addUsersToRoom(room: RoomI, userIds: string[]) {
		const users = await this.userRepository.findBy({ id: In(userIds) })

		room.users = [...room.users, ...users]

		return room
	}

	async rollBackLastMessage(roomId) {
		const room = await this.roomRepository.findOne({
			where: { id: roomId },
			relations: ['messages', 'lastMessage'],
		})
		const newLastMessage = room.messages.length > 1 ? room.messages[room.messages.length - 2] : null
		// console.log('This is newLastMessage', newLastMessage)

		room.lastMessage = newLastMessage
		const res = await this.roomRepository.save(room)
		// console.log('This is res', res)
		// console.log('This is room', room)
	}
}
