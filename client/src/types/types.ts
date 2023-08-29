// export type IRoom = {
// 	id: number
// 	name: string
// 	description?: string
// 	users?: User[]
// }

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
	users: TUser[]
	lastMessage: null | TMessage
	// notifications: SimpleRoomNotifications
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
	user: TUser
	room: TRoom
	created_at: Date
	updated_at: Date
}

export type TSentMessage = {
	text: string
	room: number
}

export type TUser = {
	id: string
	username: string
	online?: boolean
}

export type TNotification = {
	id: number
	creator: TUser
	message: TMessage
	// room: RoomI
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
