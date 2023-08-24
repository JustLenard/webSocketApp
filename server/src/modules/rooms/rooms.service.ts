import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import * as argon2 from 'argon2'
import { InjectRepository } from '@nestjs/typeorm'
import { RoomEntity } from 'src/utils/entities/room.entity'
import { AccountType, UserEntity } from 'src/utils/entities/user.entity'
import { RoomI } from 'src/utils/types/entities.types'
import { DataSource, In, Repository } from 'typeorm'
import { CreateRoomDto } from './dto/create-room.dto'
import { CreateRoomParams } from 'src/utils/types/types'
import { MessageEntity } from 'src/utils/entities/message.entity'
import { GLOBAL_ROOM_NAME } from 'src/utils/constants'

@Injectable()
export class RoomsService implements OnModuleInit {
	async onModuleInit() {
		this.logger.log(`Initializing Room Service`)
		const { ADMIN_NAME, ADMIN_PASSWORD } = process.env
		let admin = await this.userRepository.findOneBy({
			username: ADMIN_NAME,
		})

		if (!admin) {
			this.logger.warn(`Admin user not found`)
			const hashedPassword = await argon2.hash(ADMIN_PASSWORD)
			admin = await this.userRepository
				.create({
					username: ADMIN_NAME,
					password: hashedPassword,
					accountType: AccountType.admin,
				})
				.save()
			this.logger.warn(`Created admin user`)

			let globalRoom = await this.roomRepository.findOne({
				where: { name: GLOBAL_ROOM_NAME },
				relations: ['users'], // Make sure the users relation is eagerly loaded
			})

			if (!globalRoom) {
				this.logger.warn(`Global room not found`)
				globalRoom = await this.roomRepository
					.create({
						name: GLOBAL_ROOM_NAME,
						users: [admin],
						isGroupChat: true,
					})
					.save()

				// const mate = await this.roomRepository.findOne({
				// 	where: { name: GLOBAL_ROOM_NAME },
				// 	relations: ['users'], // Make sure the users relation is eagerly loaded
				// })

				// mate.users.push(admin)

				// await this.roomRepository.save(mate)

				// await this.roomRepository.save(globalRoom)
				this.logger.warn(`Crated Global room`)
			}
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
			.leftJoinAndSelect('room.lastMessage', 'lastMessage')
			.leftJoinAndSelect('lastMessage.user', 'messageUser')
			.leftJoin('room.users', 'allUsers')
			.select([
				'room',
				'allUsers.id',
				'allUsers.username',
				'lastMessage',
				'messageUser.id',
				'messageUser.username',
			])
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

	async getRoomByName(roomName: string): Promise<RoomEntity> {
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

		return this.roomRepository.update(room.id, { lastMessage: message })
		// return this.roomRepository.save(room)
	}

	async addUsersToRoom(room: RoomI, userIds: string[]) {
		const users = await this.userRepository.findBy({ id: In(userIds) })

		room.users = [...room.users, ...users]

		return room
	}

	async setNewLastMesasgeIfNeeded(roomId: number, message: MessageEntity) {
		const room = await this.roomRepository.findOne({
			where: { id: roomId },
			relations: ['messages', 'lastMessage'],
		})
		if (room.lastMessage.id !== message.id) return
		const newLastMessage = room.messages.length > 1 ? room.messages[room.messages.length - 2] : null

		room.lastMessage = newLastMessage
		await this.roomRepository.save(room)
	}
}
