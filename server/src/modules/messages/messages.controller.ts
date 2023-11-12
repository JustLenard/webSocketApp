import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Inject,
	Logger,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { GetCurrentUser } from 'src/common/decorators/getCurrentUser.decorator'
import { AtGuard } from 'src/common/guards/at.guard'
import { Routes, appEmitters } from 'src/utils/constants'
import { AccountType, UserEntity } from 'src/utils/entities/user.entity'
import { ImageStorageService } from '../image-storage/image-storage.service'
import { NotificationsService } from '../notifications/notifications.service'
import { OpenAiService } from '../open-ai/open-ai.service'
import { RoomsService } from '../rooms/rooms.service'
import { MessageDto } from './dto/create-message.dto'
import { UpdateMessageDto } from './dto/update-message.dto'
import { MessageService } from './messages.service'

@Controller(Routes.messages)
export class MessageController {
	constructor(
		private messageService: MessageService,
		private openAiService: OpenAiService,
		private notifService: NotificationsService,
		private roomService: RoomsService,
		private readonly eventEmitter: EventEmitter2,
		@Inject('uploadImages') private readonly imageStorageService: ImageStorageService,
	) {}

	private logger = new Logger('Message controler')

	@UseGuards(AtGuard)
	@Get()
	@HttpCode(HttpStatus.OK)
	async findMessagesForRoom(@Param('roomId', ParseIntPipe) roomId: number) {
		this.logger.log(`Getting messages for room ${roomId}`)
		const messages = await this.messageService.getMessagesForRoom(roomId)

		return Promise.all(
			messages.map(async (message) => {
				const avatar = message.user.profile?.avatar
				if (avatar) {
					message.user.profile.avatar = await this.imageStorageService.get(avatar)
				}
				return message
			}),
		)
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
		this.logger.log(`Created message: ${message.text}`)
		await this.roomService.addLastMessageToRoom(room, message)

		const notif = await this.notifService.createNotification(message, room)

		this.eventEmitter.emit(appEmitters.messageCreate, { message, roomId })
		this.eventEmitter.emit(appEmitters.notificationsCreate, { notif, roomId, userId: user.id })

		const botAccount = room.users.find((user) => user.accountType === AccountType.bot && room.isGroupChat === false)
		if (botAccount) this.openAiService.respondToMessage(room, botAccount)

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
		const { message } = await this.messageService.deleteMessage(messageId, user.id, roomId)
		message.user = { id: message.user.id, username: message.user.username } as UserEntity
		this.eventEmitter.emit(appEmitters.messageDelete, { message, roomId })
		return 'ok'
	}
}
