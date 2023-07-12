import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MessageI } from 'src/types/entities.types'
import { Repository } from 'typeorm'
import { MessageEntity } from '../entities/message.entity'
import { MessageDto } from '../dto/message.dto'

@Injectable()
export class MessageService {
	constructor(
		@InjectRepository(MessageEntity)
		private readonly messageRepository: Repository<MessageI>,
	) {}

	/**
	 * @todo fix type on this
	 **/
	async createMessage(message: MessageDto | MessageI): Promise<MessageI> {
		return this.messageRepository.save(this.messageRepository.create(message))
	}

	async findMessagesForRoom(roomId: number): Promise<MessageI[]> {
		return this.messageRepository
			.createQueryBuilder('message')
			.leftJoin('message.room', 'room')
			.where('room.id = :roomId', { roomId })
			.leftJoinAndSelect('message.user', 'user')
			.orderBy('message.created_at', 'ASC')
			.getMany()
	}
}
