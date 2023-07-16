import { MessageEntity } from '../entities/message.entity'
import { RoomEntity } from '../entities/room.entity'
import { UserEntity } from '../entities/user.entity'

export type JwtPayload = {
	username: string
	sub: string
}

export type Tokens = {
	accessToken: string
	refreshToken: string
}

export type CreateMessageParams = {
	roomId: number
	content: string
	// user: User
}

export type CreateMessageEvent = {
	message: MessageEntity
	room: RoomEntity
	user: UserEntity
}
