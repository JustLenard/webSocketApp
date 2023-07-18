export interface LogInCredentials {
	username: string
	password: string
}

export interface SignUpForm {
	username: string
	password: string
	cpassword: string
}

export type CreateRoomParams = {
	name?: string
	description?: string
	isGroupChat: boolean
	users: string[]
}
