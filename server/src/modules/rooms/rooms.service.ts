import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { RoomI, UserI } from 'src/utils/types/entities.types'
import { PostRoomI } from 'src/utils/types/frontEnd.types'
import { UserEntity } from 'src/utils/entities/user.entity'
import { RoomEntity } from 'src/utils/entities/room.entity'

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
		return (
			this.roomRepository
				.createQueryBuilder('room')
				.leftJoin('room.users', 'users')
				.where('users.id = :userId', { userId: userId })
				// .leftJoinAndSelect('room.users', 'all_users')
				.getMany()
		)
	}

	// async getRoomsForUser(userId: number) {
	// 	return this.roomRepository
	// 		.createQueryBuilder('room')
	// 		.leftJoin('room.users', 'users')
	// 		.where('users.id = :userId', { userId: userId })
	// 		.getMany()
	// }
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

	async findRoomById(roomId: number): Promise<RoomEntity> {
		return this.roomRepository
			.createQueryBuilder('room')
			.leftJoinAndSelect('room.users', 'users')
			.where('room.id = :id', { id: roomId })
			.getOne()
	}

	async createRoom(room: PostRoomI, creator: UserI) {
		this.logger.debug('creating room')

		const privateChat = await this.checkIfPrivateChatExits(creator.id, room.users[0])
		if (privateChat) {
			this.logger.warn('Room already exists. Aborting')
			return privateChat
		}

		const newRoom = await this.addUsersToRoom({ ...room, users: [creator] }, room.users)

		// return this.roomRepository.save(newRoom)
	}

	async getRoomByName(roomName = 'Global'): Promise<RoomEntity> {
		return this.roomRepository.findOne({
			where: { name: roomName },
		})
	}

	async checkIfPrivateChatExits(firstUserId: string, secondUserId: string): Promise<number | boolean> {
		const result = await this.privateChatExists(firstUserId, secondUserId)

		return result ? result.id : false
	}

	async userIsPartOfRoom(room: RoomI, userId: string) {
		return room.users.find((user) => user.id === userId)
	}

	async addUsersToRoom(room: RoomI, userIds: string[]) {
		const users = await this.userRepository.findBy({ id: In(userIds) })

		room.users = [...room.users, ...users]

		return room
	}
}
