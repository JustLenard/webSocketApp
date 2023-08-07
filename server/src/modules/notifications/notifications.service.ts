import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MessageEntity } from 'src/utils/entities/message.entity'
import { NotificationsEntity } from 'src/utils/entities/notifications.entity'
import { RoomEntity } from 'src/utils/entities/room.entity'
import { UserEntity } from 'src/utils/entities/user.entity'
import { In, Repository } from 'typeorm'

@Injectable()
export class NotificationsService {
	constructor(@InjectRepository(NotificationsEntity) private notifRepository: Repository<NotificationsEntity>) {}

	async createNotification(message: MessageEntity, room: RoomEntity) {
		const newNotification = this.notifRepository.create({
			creator: message.user,
			message: message,
			room: room,
			readBy: [],
			createdFor: room.users.filter((user) => user.id !== message.user.id),
		})

		await this.notifRepository.save(newNotification)
	}

	getUserNotifications(user: UserEntity) {
		const userNotifications = this.notifRepository
			.createQueryBuilder('notification')
			.leftJoinAndSelect('notification.creator', 'creator')
			.leftJoinAndSelect('notification.message', 'message')
			.leftJoinAndSelect('notification.readBy', 'readBy')
			.leftJoinAndSelect('notification.createdFor', 'createdFor')
			.leftJoinAndSelect('notification.room', 'room')
			.where('createdFor.id = :userId', { userId: user.id })
			.andWhere('(readBy.id != :userId OR readBy.id IS NULL OR readBy.id = :emptyUuid)', {
				userId: user.id,
				emptyUuid: '00000000-0000-0000-0000-000000000000',
			})
			.orderBy('notification.created_at', 'DESC')
			.getMany()

		return userNotifications
	}

	getNotificationsForRoom(user: UserEntity, room: RoomEntity) {
		const userNotifications = this.notifRepository
			.createQueryBuilder('notification')
			.leftJoinAndSelect('notification.creator', 'creator')
			.leftJoinAndSelect('notification.message', 'message')
			.leftJoinAndSelect('notification.readBy', 'readBy')
			.leftJoinAndSelect('notification.createdFor', 'createdFor')
			.leftJoinAndSelect('notification.room', 'room')
			.where('createdFor.id = :userId', { userId: user.id })
			.andWhere('(readBy.id != :userId OR readBy.id IS NULL OR readBy.id = :emptyUuid)', {
				userId: user.id,
				emptyUuid: '00000000-0000-0000-0000-000000000000',
			})
			.andWhere('room.id = :roomId', {
				roomId: room.id,
			})
			.orderBy('notification.created_at', 'DESC')
			.getMany()

		return userNotifications
	}
}
