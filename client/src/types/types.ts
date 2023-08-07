export type User = {
	id: number
}

export type IRoom = {
	id: number
	name: string
	description?: string
	users?: User[]
}

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
	message: MessageI
}

export type RoomI = {
	id: number
	name: string
	isGroupChat: boolean
	description?: string
	users: UserI[]
	lastMessage: null | MessageI
	notifications: Notification[]
}

export type PostRoomI = {
	name: string
	description?: string
	users: string[]
	isGroupChat: false
}

export type MessageI = {
	id: number
	text: string
	user: UserI
	room: RoomI
	created_at: Date
	updated_at: Date
}

export type ISentMessage = {
	text: string
	room: number
}

export type UserI = {
	id: string
	username: string
	online: boolean
}

export type Notification = {
	id: number
	creator: UserI
	message: MessageI
	room: RoomI
}

/**
 * Socket event payloads
 **/
export type MessageSocketEvent = {
	message: MessageI
	roomId: number
}
