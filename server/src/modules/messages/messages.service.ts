import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MessageI } from 'src/utils/types/entities.types'
import { Repository } from 'typeorm'
import { UsersService } from 'src/modules/users/users.service'
import { UserEntity } from 'src/utils/entities/user.entity'
import { MessageEntity } from 'src/utils/entities/message.entity'
import { MessageDto } from './dto/create-message.dto'
import { RoomsService } from '../rooms/rooms.service'

@Injectable()
export class MessageService {
	constructor(
		@InjectRepository(MessageEntity)
		private readonly messageRepository: Repository<MessageEntity>,

		// private userService: UsersService,
		private roomService: RoomsService,
	) {}

	async createMessage(message: MessageDto, user: UserEntity): Promise<MessageEntity> {
		const room = await this.roomService.findRoomById(message.roomId)

		if (!room) throw new BadRequestException('Room does not exist')

		console.log('This is room', room)

		const newMessage = this.messageRepository.create({
			text: message.text,
			room,
			user,
		})

		return this.messageRepository.save(newMessage)
	}

	async findMessagesForRoom(roomId: number): Promise<any[]> {
		return this.messageRepository
			.createQueryBuilder('message')
			.leftJoin('message.room', 'room')
			.where('room.id = :roomId', { roomId })
			.leftJoinAndSelect('message.user', 'user')
			.orderBy('message.created_at', 'ASC')
			.getMany()
	}

	async patchMessage(messageId: number, newContent: string) {
		return this.messageRepository.save({
			id: messageId,
			text: newContent,
		})
	}

	async deleteMessage(messageId: number) {
		this.messageRepository.delete({ id: messageId })
		return 'ok'
	}
}
