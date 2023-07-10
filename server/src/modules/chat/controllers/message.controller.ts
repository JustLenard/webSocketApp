import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common'
import { AtGuard } from 'src/common/guards/at.guard'
import { MessageI } from 'src/types/entities.types'
import { MessageDto } from '../dto/message.dto'
import { MessageService } from '../service/message.service'

@Controller('/api/messages')
export class MessageController {
	constructor(private readonly messageService: MessageService) {}

	@UseGuards(AtGuard)
	@Get('/:id')
	@HttpCode(HttpStatus.CREATED)
	findMessagesForRoom(@Param('id') id: number): Promise<MessageI[]> {
		console.log('This is id', id)
		return this.messageService.findMessagesForRoom(id)
	}

	@UseGuards(AtGuard)
	@Post('/')
	@HttpCode(HttpStatus.CREATED)
	createMessage(@Body() dto: MessageDto): Promise<MessageI> {
		return this.messageService.createMessage(dto)
	}
}
