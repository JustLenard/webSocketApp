import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { MessageEntity } from '../entities/message.entity'
import { RoomEntity } from '../entities/room.entity'
import { JoinedRoomI, MessageI } from 'src/types/entities.types'

@Injectable()
export class MessageService {
	constructor(
		@InjectRepository(MessageEntity)
		private readonly messageRepository: Repository<MessageI>,
	) {}

	async create(message: MessageI): Promise<MessageI> {
		return this.messageRepository.save(this.messageRepository.create(message))
	}

	async findMessagesForRoom(room: JoinedRoomI): Promise<MessageI[]> {
		return this.messageRepository
			.createQueryBuilder('message')
			.leftJoin('message.room', 'room')
			.where('room.id = :roomId', { roomId: room.id })
			.leftJoinAndSelect('message.user', 'user')
			.orderBy('message.created_at', 'ASC')
			.getMany()
	}
}
