import { AccountType } from '../entities/user.entity'

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
	isGroupChat: boolean
}

export interface MessageI {
	id?: number
	text: string
	// room: RoomI
	room: number
	// user: UserI
	user: string

	created_at?: Date
	updated_at?: Date
}

export type ShortUser = {
	id: string
	username: string
}
