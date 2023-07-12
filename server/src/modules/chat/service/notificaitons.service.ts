import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from 'src/modules/users/entities/user.entity'
import { NotificationI, RoomI } from 'src/types/entities.types'
import { Repository } from 'typeorm'
import { RoomEntity } from '../entities/room.entity'
import { NotificationsEntity } from '../entities/notifications.entity'
import { MessageEntity } from '../entities/message.entity'

@Injectable()
export class NotificaitonsService implements OnModuleInit {
	async onModuleInit() {
		console.log(`The module has been initialized.`)

		const len = await this.userRepository.findOneBy({ username: 'len' })
		const len2 = await this.userRepository.findOneBy({ username: 'len2' })

		const message = await this.messageRepository.findOneBy({ id: 1 })

		const newNotifications: NotificationI = {
			createdFor: [len],
			creatorId: len2.id,
			roomId: 1,
			readBy: [],
			message: {
				room: message.room.id,
				text: message.text,
				user: message.user.id,
			},
		}

		console.log('This isnewNotifications', newNotifications)

		this.notificationsRepository.save(newNotifications)
	}

	constructor(
		@InjectRepository(RoomEntity)
		private readonly roomRepository: Repository<RoomEntity>,

		@InjectRepository(MessageEntity)
		private readonly messageRepository: Repository<MessageEntity>,

		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,

		@InjectRepository(NotificationsEntity)
		private readonly notificationsRepository: Repository<NotificationsEntity>,
	) {}

	private logger: Logger = new Logger('Room Service')
}
