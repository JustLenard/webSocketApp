import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Post, UseGuards } from '@nestjs/common'
import { GetCurrentUser } from 'src/common/decorators/getCurrentUser.decorator'
import { AtGuard } from 'src/common/guards/at.guard'
import { RoomsService } from './rooms.service'
import { UserEntity } from 'src/utils/entities/user.entity'
import { CreateRoomDto } from './dto/create-room.dto'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Routes, appEmitters } from 'src/utils/constants'
import { NotificationsService } from '../notifications/notifications.service'

@Controller(Routes.rooms)
export class RoomControler {
	constructor(
		private readonly roomService: RoomsService,
		private readonly notifService: NotificationsService,
		private readonly eventEmitter: EventEmitter2,
	) {}

	private logger: Logger = new Logger('Room Service')

	@UseGuards(AtGuard)
	@Get()
	@HttpCode(HttpStatus.OK)
	async getRoomsForUser(@GetCurrentUser() user: UserEntity) {
		const userRooms = await this.roomService.getRoomsForUser(user.id)
		const roomsWithNotifications = await Promise.all(
			userRooms.map(async (room) => {
				const notif = await this.notifService.getUnreadNotificationsAmount(user, room.id)
				return {
					...room,
					notifications: notif,
				}
			}),
		)

		return roomsWithNotifications
	}

	@UseGuards(AtGuard)
	@Post()
	@HttpCode(HttpStatus.CREATED)
	async createRoom(@GetCurrentUser() user: UserEntity, @Body() dto: CreateRoomDto) {
		console.log('This is dto', dto)
		const privateChat = await this.roomService.checkIfPrivateChatExits(user.id, dto.users[0])

		if (privateChat) {
			this.logger.warn('Room already exists. Aborting')
			return privateChat
		}

		this.logger.warn('Creating new room')
		const newRoom = await this.roomService.createRoom(dto, user)
		newRoom.users = newRoom.users.map((user) => ({ id: user.id, username: user.username } as UserEntity))

		this.eventEmitter.emit(appEmitters.roomCreate, { room: newRoom, creatorId: user.id })
		return { ...newRoom, notifications: 0 }
	}
}
