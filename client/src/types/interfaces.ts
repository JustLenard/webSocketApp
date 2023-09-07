export interface IShortUser {
	id: string
	username: string
}

export interface OnlinseUser extends IShortUser {
	online?: boolean
}
