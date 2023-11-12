export interface IShortUser {
	id: string
	username: string
	imageUrl: string
	profile?: {
		avatar: string
	}
}

export interface IOnlinseUser extends IShortUser {
	online?: boolean
}
