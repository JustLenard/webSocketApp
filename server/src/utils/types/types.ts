import { MessageEntity } from '../entities/message.entity'
import { NotificationsEntity } from '../entities/notifications.entity'
import { RoomEntity } from '../entities/room.entity'

export type JwtPayload = {
	username: string
	sub: string
}

export type Tokens = {
	accessToken: string
	refreshToken: string
}

export type CreateMessageParams = {
	roomId: number
	content: string
	// user: User
}

export type CreateMessageEvent = {
	message: MessageEntity
	roomId: number
}

export type CreateNotificationEvent = {
	notif: NotificationsEntity
	roomId: number
}

export type BotTypeEvent = {
	botUsername: string
	userId: string
}

export type CreateRoomParams = {
	name?: string
	description?: string
	isGroupChat: boolean
	users: string[]
}

export type CreateRoomEvent = {
	room: RoomEntity
	creatorId: string
}

export type CreateMessageResponse = {
	message: MessageEntity
	conversation: RoomEntity
}

export type SimpleRoomNotifications = {
	roomId: number
	lastMessage: MessageEntity
	unreadNotificationsAmount: number
}
export type UserProfileFiles = Partial<{
	banner: Express.Multer.File[]
	avatar: Express.Multer.File[]
}>

export type UpdateUserProfileParams = Partial<{
	banner: Express.Multer.File
	avatar: Express.Multer.File
}>

export type UploadImageParams = {
	key: string
	file: Express.Multer.File
}
