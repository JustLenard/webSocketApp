import { ForbiddenException, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { Request } from 'express'
import { Strategy } from 'passport-jwt'
import { REFRESH_TOKEN } from 'src/utils/constants'
import { UserEntity } from 'src/utils/entities/user.entity'
import { JwtPayload } from 'src/utils/types/types'
import { Repository } from 'typeorm'

const extractCookie = (req, cookie = REFRESH_TOKEN) => {
	let token = null
	if (req && req.cookies) {
		token = req.cookies[cookie]
	}
	return token
}

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
	constructor(@InjectRepository(UserEntity) private userRepostiry: Repository<UserEntity>) {
		super({
			jwtFromRequest: extractCookie,
			secretOrKey: process.env.REFRESH_TOKEN_SECRET,
			passReqToCallback: true,
		})
	}

	async validate(req: Request, payload: JwtPayload) {
		const refreshToken = extractCookie(req)
		const user = await this.userRepostiry.findOneBy({ id: payload.sub })
		if (!refreshToken) throw new ForbiddenException('Refresh token malformed')

		return {
			...user,
			refreshToken,
		}
	}
}
