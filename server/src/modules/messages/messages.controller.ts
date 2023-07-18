import {
	BadRequestException,
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Inject,
	Param,
	ParseIntPipe,
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
import { appEmitters } from 'src/utils/constants'

@Controller('/api/messages')
export class MessageController {
	constructor(
		private messageService: MessageService,
		private roomService: RoomsService,
		private readonly eventEmitter: EventEmitter2,
	) {}

	@UseGuards(AtGuard)
	@Get('/:roomId')
	@HttpCode(HttpStatus.CREATED)
	findMessagesForRoom(@Param('roomId', ParseIntPipe) roomId: number): Promise<MessageI[]> {
		return this.messageService.findMessagesForRoom(roomId)
	}

	@UseGuards(AtGuard)
	@Post('/')
	@HttpCode(HttpStatus.CREATED)
	async createMessage(@Body() dto: MessageDto, @GetCurrentUser() user: UserEntity) {
		const room = await this.roomService.findRoomById(dto.roomId)

		console.log('sending message to room', room)
		if (!room) throw new BadRequestException('Room does not exist')

		const message = await this.messageService.createMessage(dto, user)

		this.eventEmitter.emit(appEmitters.messageCreate, { message, room, user })

		return message
	}
}
