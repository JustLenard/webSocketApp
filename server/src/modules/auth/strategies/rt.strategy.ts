// import { PassportStrategy } from '@nestjs/passport'
// import { ExtractJwt, Strategy } from 'passport-jwt'
// import { Request } from 'express'
// import { ForbiddenException, Injectable } from '@nestjs/common'
// import { JwtPayload } from 'src/types/jwtPayload.types'

// @Injectable()
// export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
// 	constructor() {
// 		console.log('This is process.env.accessToken_SECRET,', process.env.accessToken_SECRET)
// 		super({
// 			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
// 			secretOrKey: process.env.accessToken_SECRET,
// 			passReqToCallback: true,
// 		})
// 	}

// 	validate(req: Request, payload: JwtPayload) {
// 		const refreshToken = req?.get('authorization')?.replace('Bearer', '')?.trim()

// 		if (!refreshToken) throw new ForbiddenException('Refresh token malformed')

// 		return {
// 			...payload,
// 			refreshToken,
// 		}
// 	}
// }

import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Request } from 'express'
import { ForbiddenException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtPayload } from 'src/types/jwtPayload.types'

const extractCookie = (req, cookie = 'refreshToken') => {
	let token = null
	if (req && req.cookies) {
		token = req.cookies[cookie]

		console.log('This is req.cookies', req.cookies)
		console.log('This is token', token)
	}
	return token
}

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
	constructor(config: ConfigService) {
		super({
			jwtFromRequest: extractCookie,
			secretOrKey: process.env.REFRESH_TOKEN_SECRET,
			passReqToCallback: true,
		})
	}

	validate(req: Request, payload: JwtPayload) {
		console.log('reach')
		const refreshToken = extractCookie(req)

		if (!refreshToken) throw new ForbiddenException('Refresh token malformed')

		return {
			...payload,
			refreshToken,
		}
	}
}
