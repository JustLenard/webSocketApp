import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MessageI } from 'src/types/entities.types'
import { Repository } from 'typeorm'
import { MessageEntity } from '../entities/message.entity'
import { MessageDto } from '../dto/message.dto'
import { UsersService } from 'src/modules/users/users.service'
import { RoomService } from './room.service'

@Injectable()
export class MessageService {
	constructor(
		@InjectRepository(MessageEntity)
		private readonly messageRepository: Repository<MessageEntity>,

		private userService: UsersService,
		private roomService: RoomService,
	) {}

	async createMessage(message: MessageDto, userId: string): Promise<any> {
		const user = await this.userService.findById(userId)
		const room = await this.roomService.findRoomById(message.roomId)

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
}
