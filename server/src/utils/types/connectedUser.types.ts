import { UserI } from './entities.types'

export interface ConnectedUserI {
	id?: number
	socketId: string
	user: UserI
}
