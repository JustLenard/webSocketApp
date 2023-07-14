export type JwtPayload = {
	username: string
	sub: string
}

export type CreateMessageParams = {
	roomId: number
	content: string
	// user: User
}
