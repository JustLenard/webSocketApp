import { BadRequestException, Injectable, Logger } from '@nestjs/common'
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
	private readonly logger = new Logger('Message service')

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
		this.logger.log(`Patching message ${messageId}`)
		const message = await this.messageRepository.findOne({
			where: { id: messageId, user: { id: userId } },
			relations: ['user'],
		})
		if (!message) {
			throw new BadRequestException('Cannot patch message')
		}
		message.text = newContent

		const res = await this.messageRepository.save(message)
		console.log('This is res', res)
		return res
	}

	async deleteMessage(messageId: number, userId: string, roomId: number) {
		this.logger.log(`Deleting message ${messageId}`)
		const message = await this.messageRepository.findOne({
			where: { id: messageId, user: { id: userId }, room: { id: roomId } },
			relations: ['user', 'room'],
		})
		console.log('This is message', message)

		if (!message) {
			throw new BadRequestException('Cannot delete message')
		}

		const { room, isLastMessage } = await this.roomService.isLastMessageInRoom(message)
		console.log('This is isLastMessage', isLastMessage)

		if (isLastMessage) {
			await this.roomService.setNewLastMesasge(room)
			await this.messageRepository.delete({ id: messageId })
			return { isLastMessage, message }
		}

		await this.messageRepository.delete({ id: messageId })
		return { isLastMessage, message }
	}
}
