import { Socket } from 'socket.io'
import { UserEntity } from '../entities/user.entity'

export interface AuthenticatedSocket extends Socket {
	user?: UserEntity
}

export interface IShortUser {
	id: string
	username: string
}

export interface OnlinseUser extends IShortUser {
	online?: boolean
}
