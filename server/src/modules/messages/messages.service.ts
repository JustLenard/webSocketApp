import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MessageEntity } from 'src/utils/entities/message.entity'
import { RoomEntity } from 'src/utils/entities/room.entity'
import { UserEntity } from 'src/utils/entities/user.entity'
import { Repository } from 'typeorm'
import { RoomsService } from '../rooms/rooms.service'
import { MessageDto } from './dto/create-message.dto'

@Injectable()
export class MessageService {
	constructor(
		@InjectRepository(MessageEntity)
		private readonly messageRepository: Repository<MessageEntity>,
		private roomService: RoomsService,
	) {}

	async createMessage(message: MessageDto, user: UserEntity, room: RoomEntity): Promise<MessageEntity> {
		const newMessage = this.messageRepository.create({
			text: message.text.trim(),
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

	async patchMessage(messageId: number, newContent: string, userId: string) {
		const message = await this.messageRepository.findOne({
			where: { id: messageId, user: { id: userId } },
			relations: ['user'],
		})
		if (!message) {
			throw new BadRequestException('Cannot patch message')
		}
		message.text = newContent

		return this.messageRepository.save(message)
	}

	async deleteMessage(messageId: number, userId: string, roomId: number) {
		const message = await this.messageRepository.findOne({
			where: { id: messageId, user: { id: userId }, room: { id: roomId } },
			relations: ['user', 'room'],
		})

		if (!message) {
			throw new BadRequestException('Cannot delete message')
		}

		const { room, isLastMessage } = await this.roomService.isLastMessageInRoom(message)

		if (isLastMessage) {
			const newLastMessage = await this.roomService.setNewLastMesasge(room)
			await this.messageRepository.delete({ id: messageId })
			return { isLastMessage, message: newLastMessage }
		}

		await this.messageRepository.delete({ id: messageId })
		return { isLastMessage, message }
	}
}
