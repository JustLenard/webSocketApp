import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MessageEntity } from 'src/utils/entities/message.entity'
import { RoomEntity } from 'src/utils/entities/room.entity'
import { UserEntity } from 'src/utils/entities/user.entity'
import { Repository } from 'typeorm'
import { RoomsService } from '../rooms/rooms.service'
import { MessageDto } from './dto/create-message.dto'
import { ImageStorageService } from '../image-storage/image-storage.service'

@Injectable()
export class MessageService {
	constructor(
		@InjectRepository(MessageEntity)
		private readonly messageRepository: Repository<MessageEntity>,
		private roomService: RoomsService,
		@Inject('uploadImages') private readonly imageStorageService: ImageStorageService,
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

	async getMessagesForRoom(roomId: number): Promise<MessageEntity[]> {
		return this.messageRepository
			.createQueryBuilder('message')
			.leftJoin('message.room', 'room')
			.where('room.id = :roomId', { roomId })
			.leftJoinAndSelect('message.user', 'user')
			.leftJoinAndSelect('user.profile', 'profile')
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
		return res
	}

	async deleteMessage(messageId: number, userId: string, roomId: number) {
		this.logger.log(`Deleting message ${messageId}`)
		const messageToDelete = await this.messageRepository.findOne({
			where: { id: messageId, user: { id: userId }, room: { id: roomId } },
			relations: ['user', 'room', 'room.lastMessage'],
		})
		const roomMessages = await this.getMessagesForRoom(roomId)

		if (!messageToDelete) {
			throw new BadRequestException('Cannot delete message')
		}

		/**
		 * If the messageToDelete is the last message of the room, reasign the last message
		 **/
		const isLastMessage = messageToDelete.id === messageToDelete.room.lastMessage.id
		this.logger.log(`Message ${messageId} is lastMessage ${isLastMessage}`)
		if (isLastMessage) {
			this.logger.log(`Setting a new lastMesage for room`)
			await this.roomService.setNewLastMesasge(roomMessages, messageToDelete.room)
			await this.messageRepository.delete({ id: messageId })
			this.logger.log(`Message ${messageId} deleted`)
			return { isLastMessage, message: messageToDelete }
		}

		await this.messageRepository.delete({ id: messageId })
		this.logger.log(`Message ${messageId} deleted`)
		return { isLastMessage, message: messageToDelete }
	}
}
