import { Socket } from 'socket.io'
import { UserEntity } from './entities/user.entity'

export interface AuthenticatedSocket extends Socket {
	user?: UserEntity
}
