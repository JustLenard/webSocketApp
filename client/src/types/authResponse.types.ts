import { UserI } from './BE_entities.types'

export interface Tokens {
	accessToken: string
	refreshToken: string
}

export interface AuthReponse {
	user: UserI
	tokens: Tokens
}
