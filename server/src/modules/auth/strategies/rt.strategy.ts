// import { PassportStrategy } from '@nestjs/passport'
// import { ExtractJwt, Strategy } from 'passport-jwt'
// import { Request } from 'express'
// import { ForbiddenException, Injectable } from '@nestjs/common'
// import { JwtPayload } from 'src/types/jwtPayload.types'

// @Injectable()
// export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
// 	constructor() {
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
		const refreshToken = extractCookie(req)

		if (!refreshToken) throw new ForbiddenException('Refresh token malformed')

		return {
			...payload,
			refreshToken,
		}
	}
}
