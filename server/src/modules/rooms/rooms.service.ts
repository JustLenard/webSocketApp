import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as argon2 from 'argon2'
import { BOT_USERS, GLOBAL_ROOM_NAME, GUEST_USERS } from 'src/utils/constants'
import { MessageEntity } from 'src/utils/entities/message.entity'
import { RoomEntity } from 'src/utils/entities/room.entity'
import { AccountType, UserEntity } from 'src/utils/entities/user.entity'
import { generatePassword } from 'src/utils/helpers'
import { CreateRoomParams } from 'src/utils/types/types'
import { In, Repository } from 'typeorm'

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
				globalRoom = this.roomRepository.create({
					name: GLOBAL_ROOM_NAME,
					users: [admin],
					isGroupChat: true,
				})

				this.logger.warn(`Crated Global room`)

				const botAccounts = await this.userRepository.findOneBy({ accountType: AccountType.bot })
				/**
				 * Create bot accounts
				 **/
				if (!botAccounts) {
					this.logger.warn('Creating bot accounts')
					await Promise.all(
						BOT_USERS.map(async (botUser) => {
							const newBotUser = await this.userRepository
								.create({
									username: botUser.userName,
									password: await argon2.hash(generatePassword(12)),
									accountType: AccountType.bot,
								})
								.save()
							globalRoom.users.push(newBotUser)
						}),
					)
				}

				const guestAccouns = await this.userRepository.findOneBy({ accountType: AccountType.guest })
				/**
				 * Create guest accounts
				 **/
				if (!guestAccouns) {
					this.logger.warn('Creating guest accounts')
					await Promise.all(
						GUEST_USERS.map(async (user) => {
							const newGuestUser = await this.userRepository
								.create({
									username: user,
									password: await argon2.hash(generatePassword(12)),
									accountType: AccountType.guest,
								})
								.save()
							globalRoom.users.push(newGuestUser)
						}),
					)
				}
				await this.roomRepository.save(globalRoom)
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
		this.logger.debug('Creating new room')
		const newRoom = await this.addUsersToRoom({ ...room, users: [creator] } as RoomEntity, room.users)
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

	async userIsPartOfRoom(room: RoomEntity, userId: string) {
		return room.users.find((user) => user.id === userId)
	}

	async addLastMessageToRoom(room: RoomEntity, message: MessageEntity) {
		return this.roomRepository.update(room.id, { lastMessage: message })
	}

	async addUsersToRoom(room: RoomEntity, userIds: string[]) {
		const users = await this.userRepository.findBy({ id: In(userIds) })

		room.users = [...room.users, ...users]

		return room
	}

	async setNewLastMesasge(room: RoomEntity) {
		const newLastMessage = room.messages.length > 1 ? room.messages[room.messages.length - 2] : null

		room.lastMessage = newLastMessage
		await this.roomRepository.save(room)
		return newLastMessage
	}

	async isLastMessageInRoom(message: MessageEntity) {
		const room = await this.roomRepository.findOne({
			where: { id: message.room.id },
			relations: ['messages', 'lastMessage'],
		})

		return {
			isLastMessage: room.lastMessage.id === message.id,
			room,
		}
	}
}
