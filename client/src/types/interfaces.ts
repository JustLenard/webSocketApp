export interface IShortUser {
	id: string
	username: string
}

export interface IOnlinseUser extends IShortUser {
	online?: boolean
}
