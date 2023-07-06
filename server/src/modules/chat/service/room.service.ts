import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { RoomEntity } from '../entities/room.entity'
import { In, Repository } from 'typeorm'
import { RoomI, UserI } from 'src/types/entities.types'
import { UserEntity } from 'src/modules/users/entities/user.entity'
import { PostRoomI } from 'src/types/frontEnd.types'

@Injectable()
export class RoomService implements OnModuleInit {
	async onModuleInit() {
		console.log(`The module has been initialized.`)
		const globalRoom = await this.getRoomByName()

		const admin = await this.userRepository.findOne({
			where: {
				username: 'len',
			},
			// relations: ['rooms'],
		})

		if (!globalRoom) {
			console.log('creating global Room')

			const globalRoom: RoomI = {
				name: 'Global',
				users: [admin],
				isGroupChat: true,
			}

			console.log('This is globalRoom', globalRoom)

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

	async getRoomsForUser(userId: number) {
		return this.roomRepository
			.createQueryBuilder('room')
			.leftJoin('room.users', 'users')
			.where('users.id = :userId', { userId: userId })
			.leftJoinAndSelect('room.users', 'all_users')
			.getMany()
	}

	// async getRoomsForUser(userId: number) {
	// 	return this.roomRepository
	// 		.createQueryBuilder('room')
	// 		.leftJoin('room.users', 'users')
	// 		.where('users.id = :userId', { userId: userId })
	// 		.getMany()
	// }

	async privateChatExists(firstUserId: number, secondUserId: number): Promise<null | RoomEntity> {
		return this.roomRepository
			.createQueryBuilder('room')
			.leftJoin('room.users', 'users')
			.leftJoin('room.users', 'all_users')
			.where('users.id = :userId', { userId: firstUserId })
			.andWhere('room.isGroupChat = :isGroupChat', { isGroupChat: false })
			.andWhere('all_users.id = :secondUserId', { secondUserId: secondUserId })
			.getOne()
	}

	// async getRoomsForUser(userId: number) {
	// 	return (
	// 		this.roomRepository
	// 			.createQueryBuilder('room')
	// 			.leftJoin('room.users', 'users')
	// 			.where('users.id = :userId', { userId: userId })
	// 			.leftJoin('room.users', 'all_users')
	// 			.select(['all_users.id', 'room.name', 'room.id'])
	// 			// .leftJoinAndMapOne('all_users.id',, 'what')

	// 			// .select(['all_uesrs.id'])
	// 			// .select(['room.id', 'room.name'])
	// 			// .getMany()
	// 			.getRawMany()
	// 	)
	// }

	async getRoomById(roomId: number): Promise<RoomEntity> {
		return this.roomRepository.findOne({
			where: { id: roomId },
		})
	}

	async createRoom(room: PostRoomI, creator: UserI) {
		this.logger.debug('creating room')

		console.log('This is room', room)

		const privateChat = await this.checkIfPrivateChatExits(creator.id, room.users[0])
		if (privateChat) {
			this.logger.warn('Room already exists. Aborting')
			return privateChat
		}

		const newRoom = await this.addUsersToRoom({ ...room, users: [creator] }, room.users)

		console.log('reached end')

		return this.roomRepository.save(newRoom)
	}

	async getRoomByName(roomName = 'Global'): Promise<RoomEntity> {
		return this.roomRepository.findOne({
			where: { name: roomName },
		})
	}

	async checkIfPrivateChatExits(firstUserId: number, secondUserId: number): Promise<number | boolean> {
		// console.log('This is firstUserId', firstUserId)
		// console.log('This is secondUserId', secondUserId)

		const result = await this.privateChatExists(firstUserId, secondUserId)

		return result ? result.id : false
	}

	async userIsPartOfRoom(room: RoomI, userId: number) {
		return room.users.find((user) => user.id === userId)
	}

	async addUsersToRoom(room: RoomI, userIds: number[]) {
		const users = await this.userRepository.findBy({ id: In(userIds) })

		room.users = [...room.users, ...users]

		return room
	}
}
