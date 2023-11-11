export interface IShortUser {
	id: string
	username: string
	imageUrl: string
}

export interface IOnlinseUser extends IShortUser {
	online?: boolean
}
