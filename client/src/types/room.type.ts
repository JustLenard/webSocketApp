import { User } from './user.type'

export interface IRoom {
	id?: number
	name: string
	description?: string
	users?: User[]
}
