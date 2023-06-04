import { User } from './user.type'

export interface Room {
	id?: number
	name: string
	description?: string
	users?: User[]
}
