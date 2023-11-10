import { IShortUser } from './interfaces'

/**
 * Authorization
 **/
export type Tokens = {
	accessToken: string
	refreshToken: string
}

export type LogInCredentials = {
	username: string
	password: string
}

export type SignUpForm = {
	username: string
	password: string
	cpassword: string
}

export type CreateRoomParams = {
	name?: string
	description?: string
	isGroupChat: boolean
	users: string[]
}

export type MessageEventParams = {
	roomId: number
	message: TMessage
}

export type TRoom = {
	id: number
	name: string
	isGroupChat: boolean
	description?: string
	users: IShortUser[]
	lastMessage: null | TMessage
	notifications: number
}

export type TPostRoom = {
	name: string
	description?: string
	users: string[]
	isGroupChat: false
}

export type TMessage = {
	id: number
	text: string
	user: IShortUser
	room: TRoom
	created_at: Date
	updated_at: Date
}

export type TSentMessage = {
	text: string
	room: number
}

export type TNotification = {
	id: number
	creator: IShortUser
	message: TMessage
	roomId: number
}

/**
 * Socket event payloads
 **/
export type MessageSocketEvent = {
	message: TMessage
	roomId: number
}

export type NotificationSocketEvent = {
	notif: TNotification
	roomId: number
}

export type SimpleRoomNotifications = {
	lastMessage: TMessage | null
	unreadNotificationsAmount: number
}

/**
 * Redux
 **/

export type TCreateNewnotification = {
	notif: TNotification
	roomId: number
	incrementNotifCount: boolean
}

export type Drawers = 'left' | 'right'

export type AppModalTypes = 'personalProfileModal'
