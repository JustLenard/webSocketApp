import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common'
import { AtGuard } from 'src/common/guards/at.guard'
import { MessageI } from 'src/utils/types/entities.types'
import { MessageDto } from '../dto/message.dto'
import { MessageService } from '../service/message.service'
import { GetCurrentUserId } from 'src/common/decorators/getCurrentUserId.decorator'

@Controller('/api/messages')
export class MessageController {
	constructor(private readonly messageService: MessageService) {}

	@UseGuards(AtGuard)
	@Get('/:roomId')
	@HttpCode(HttpStatus.CREATED)
	findMessagesForRoom(@Param('roomId', ParseIntPipe) roomId: number): Promise<MessageI[]> {
		return this.messageService.findMessagesForRoom(roomId)
	}

	@UseGuards(AtGuard)
	@Post('/')
	@HttpCode(HttpStatus.CREATED)
	createMessage(@Body() dto: MessageDto, @GetCurrentUserId() userId: string): Promise<MessageI> {
		return this.messageService.createMessage(dto, userId)
	}
}
