import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Inject,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { GetCurrentUser } from 'src/common/decorators/getCurrentUser.decorator'
import { AtGuard } from 'src/common/guards/at.guard'
import { UserEntity } from 'src/utils/entities/user.entity'
import { MessageI } from 'src/utils/types/entities.types'
import { RoomsService } from '../rooms/rooms.service'
import { MessageDto } from './dto/create-message.dto'
import { MessageService } from './messages.service'
import { Routes, appEmitters } from 'src/utils/constants'
import { UpdateMessageDto } from './dto/update-message.dto'
import { NotificationsService } from '../notifications/notifications.service'

@Controller(Routes.messages)
export class MessageController {
	constructor(
		private messageService: MessageService,
		private roomService: RoomsService,
		private notifService: NotificationsService,

		private readonly eventEmitter: EventEmitter2,
	) {}

	@UseGuards(AtGuard)
	@Get()
	@HttpCode(HttpStatus.OK)
	findMessagesForRoom(@Param('roomId', ParseIntPipe) roomId: number): Promise<MessageI[]> {
		return this.messageService.findMessagesForRoom(roomId)
	}

	@UseGuards(AtGuard)
	@Post()
	@HttpCode(HttpStatus.CREATED)
	async createMessage(
		@Body() dto: MessageDto,
		@GetCurrentUser() user: UserEntity,
		@Param('roomId', ParseIntPipe) roomId: number,
	) {
		const room = await this.roomService.findRoomById(roomId)

		if (!room) throw new BadRequestException('Room does not exist')

		const message = await this.messageService.createMessage(dto, user, room)
		await this.roomService.addLastMessageToRoom(room, message)

		const notif = await this.notifService.createNotification(message, room)

		this.eventEmitter.emit(appEmitters.messageCreate, { message, roomId })
		this.eventEmitter.emit(appEmitters.notificationsCreate, { notif, roomId, userId: user.id })

		return message
	}

	@UseGuards(AtGuard)
	@Patch(':messageId')
	@HttpCode(HttpStatus.OK)
	async patchMessage(
		@Param('messageId', ParseIntPipe) messageId: number,
		@Param('roomId', ParseIntPipe) roomId: number,
		@Body() dto: UpdateMessageDto,
		@GetCurrentUser() user: UserEntity,
	) {
		const message = await this.messageService.patchMessage(messageId, dto.text, user.id)
		message.user = { id: message.user.id, username: message.user.username } as UserEntity
		this.eventEmitter.emit(appEmitters.messagePatch, { message, roomId })
		return message
	}

	@UseGuards(AtGuard)
	@Delete(':messageId')
	@HttpCode(HttpStatus.OK)
	async deleteMessage(
		@Param('messageId', ParseIntPipe) messageId: number,
		@Param('roomId', ParseIntPipe) roomId: number,
		@GetCurrentUser() user: UserEntity,
	) {
		const message = await this.messageService.deleteMessage(messageId, user.id, roomId)
		message.user = { id: message.user.id, username: message.user.username } as UserEntity
		this.eventEmitter.emit(appEmitters.messageDelete, { message, roomId })
		return 'ok'
	}
}
