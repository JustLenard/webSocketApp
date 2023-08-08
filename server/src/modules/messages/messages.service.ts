import { BadRequestException, HttpException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MessageI } from 'src/utils/types/entities.types'
import { Repository } from 'typeorm'
import { UsersService } from 'src/modules/users/users.service'
import { UserEntity } from 'src/utils/entities/user.entity'
import { MessageEntity } from 'src/utils/entities/message.entity'
import { MessageDto } from './dto/create-message.dto'
import { RoomsService } from '../rooms/rooms.service'
import { RoomEntity } from 'src/utils/entities/room.entity'

@Injectable()
export class MessageService {
	constructor(
		@InjectRepository(MessageEntity)
		private readonly messageRepository: Repository<MessageEntity>,

		// private userService: UsersService,
		private roomService: RoomsService,
	) {}

	async createMessage(message: MessageDto, user: UserEntity, room: RoomEntity): Promise<MessageEntity> {
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
		await this.roomService.setNewLastMesasgeIfNeeded(roomId, message)
		await this.messageRepository.delete({ id: messageId })

		return message
	}
}
