import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MessageI } from 'src/utils/types/entities.types'
import { Repository } from 'typeorm'
import { MessageEntity } from '../../../utils/entities/message.entity'
import { MessageDto } from '../dto/message.dto'
import { UsersService } from 'src/modules/users/users.service'
import { Mateservice } from './room.service'
import { UserEntity } from 'src/utils/entities/user.entity'

@Injectable()
export class BadMessageService {
	constructor(
		@InjectRepository(MessageEntity)
		private readonly messageRepository: Repository<MessageEntity>,

		private userService: UsersService,
		private roomService: Mateservice,
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
}
