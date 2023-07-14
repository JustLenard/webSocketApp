import { ForbiddenException, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express'
import { Strategy } from 'passport-jwt'
import { JwtPayload } from 'src/utils/types/types'

const extractCookie = (req, cookie = 'refreshToken') => {
	let token = null
	if (req && req.cookies) {
		token = req.cookies[cookie]
	}
	return token
}

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
	constructor() {
		super({
			jwtFromRequest: extractCookie,
			secretOrKey: process.env.REFRESH_TOKEN_SECRET,
			passReqToCallback: true,
		})
	}

	validate(req: Request, payload: JwtPayload) {
		const refreshToken = extractCookie(req)

		if (!refreshToken) throw new ForbiddenException('Refresh token malformed')

		return {
			...payload,
			refreshToken,
		}
	}
}
