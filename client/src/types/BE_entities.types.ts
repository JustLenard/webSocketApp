export interface JoinedRoomI {
	id?: number
	socketId: string
	user: UserI
	room: RoomI
}

export interface RoomI {
	id?: number
	name?: string
	description?: string
	users?: UserI[]
	created_at?: Date
	updated_at?: Date
}

export interface CreateRoomI {
	name: string
	users: number[]
}

export interface MessageI {
	id?: number
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
	id: number
	username: string
}
