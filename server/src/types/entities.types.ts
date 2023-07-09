import { AccountType, UserEntity } from 'src/modules/users/entities/user.entity'

export interface UserI {
	id?: string
	username?: string
	email?: string
	password?: string
	refreshToken?: string
	rooms: RoomI[]
	accountType: AccountType
}

export interface RoomI {
	id?: number
	name?: string
	description?: string
	users?: UserI[]
	created_at?: Date
	updated_at?: Date
	isGroupChat?: boolean
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

export type ShortUser = {
	id: string
	username: string
}
