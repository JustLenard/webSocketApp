import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

type JwtPayload = {
	sub: number
	username: string
}

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor() {
		console.log('This is process.env.ACCESS_TOKEN_SECRET,', process.env.ACCESS_TOKEN_SECRET)
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.ACCESS_TOKEN_SECRET,
		})
	}

	validate(payload: JwtPayload) {
		return payload
	}
}
