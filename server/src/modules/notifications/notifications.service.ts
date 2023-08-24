import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MessageEntity } from 'src/utils/entities/message.entity'
import { NotificationsEntity } from 'src/utils/entities/notifications.entity'
import { RoomEntity } from 'src/utils/entities/room.entity'
import { UserEntity } from 'src/utils/entities/user.entity'
import { Repository } from 'typeorm'

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
		return this.notifRepository.save(newNotification)
	}

	getUserNotifications(user: UserEntity) {
		return this.notifRepository
			.createQueryBuilder('notification')
			.leftJoin('notification.creator', 'creator')
			.addSelect(['creator.id', 'creator.username'])
			.leftJoinAndSelect('notification.message', 'message')
			.leftJoinAndSelect('notification.readBy', 'readBy')
			.leftJoin('notification.createdFor', 'createdFor')
			.addSelect(['createdFor.id', 'createdFor.username'])
			.leftJoinAndSelect('notification.room', 'room')
			.where('createdFor.id = :userId', { userId: user.id })
			.andWhere('(readBy.id != :userId OR readBy.id IS NULL OR readBy.id = :emptyUuid)', {
				userId: user.id,
				emptyUuid: '00000000-0000-0000-0000-000000000000',
			})
			.orderBy('notification.created_at', 'DESC')
			.getMany()
	}

	async getNotificationsForRoom(user: UserEntity, roomId: number) {
		return this.notifRepository
			.createQueryBuilder('notification')
			.leftJoin('notification.creator', 'creator')
			.addSelect(['creator.id', 'creator.username'])
			.leftJoinAndSelect('notification.message', 'message')
			.leftJoinAndSelect('notification.readBy', 'readBy')
			.leftJoin('notification.createdFor', 'createdFor')
			.addSelect(['createdFor.id', 'createdFor.username'])
			.leftJoinAndSelect('notification.room', 'room')
			.where('createdFor.id = :userId', { userId: user.id })
			.andWhere('room.id = :roomId', {
				roomId,
			})
			.andWhere('(readBy.id != :userId OR readBy.id IS NULL OR readBy.id = :emptyUuid)', {
				userId: user.id,
				emptyUuid: '00000000-0000-0000-0000-000000000000',
			})
			.orderBy('notification.created_at', 'DESC')
			.getMany()
	}

	async markNotificationsAsReadForRoom(user: UserEntity, roomId: number) {
		console.log('Getting notiifications')
		const notifications = await this.getNotificationsForRoom(user, roomId)
		// console.log('This is notifications', notifications)

		// notifications.forEach(async (notif) => {
		// 	console.log('This is notif.reaBy', notif.readBy)
		// 	notif.readBy = [...notif.readBy, user]
		// 	console.log('This is notif.reaBy', notif.readBy)

		// 	const save = await this.notifRepository.save(notif)
		// 	console.log('This is save', save)
		// })

		const promises = notifications.map(async (notif) => {
			// console.log('This is notif.readBy', notif.readBy)
			notif.readBy = [...notif.readBy, user]
			// console.log('This is notif.readBy', notif.readBy)

			const save = await this.notifRepository.save(notif)
			// console.log('This is save', save)
		})

		await Promise.all(promises)
	}
}
