export interface JoinedRoomI {
	id?: number
	socketId: string
	user: UserI
	room: RoomI
}

export interface RoomI {
	id: number
	name: string
	isGroupChat: boolean
	description?: string
	users: UserI[]
	lastMessage: null | MessageI
}

export interface PostRoomI {
	name: string
	description?: string
	users: string[]
	isGroupChat: false
}

export interface MessageI {
	id: number
	text: string
	user: UserI
	room: RoomI
	created_at: Date
	updated_at: Date
}

export interface ISentMessage {
	text: string
	room: number
}

export interface JoinedRoomI {
	id?: number
	socketId: string
	user: UserI
	room: RoomI
}

export interface UserI {
	id: string
	username: string
	online: boolean
}
