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
	users?: number[]
	created_at?: Date
	updated_at?: Date
}

export interface MessageI {
	id?: number
	text: string
	// room: RoomI
	room: number
	// user: UserI
	user: number

	created_at?: Date
	updated_at?: Date
}

export interface FMessage {
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
	id?: number
	username?: string
	email?: string
	password?: string
	refreshToken?: string
	rooms: number[]
}

export type ShortUser = {
	id: number
	username: string
}
