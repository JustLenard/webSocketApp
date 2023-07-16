import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UserEntity } from 'src/utils/entities/user.entity'
import { JwtPayload } from 'src/utils/types/types'
import { Repository } from 'typeorm'

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(@InjectRepository(UserEntity) private userRepostiry: Repository<UserEntity>) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.ACCESS_TOKEN_SECRET,
		})
	}

	async validate(payload: JwtPayload) {
		const user = await this.userRepostiry.findOneBy({ id: payload.sub })
		console.log('request send from this user: ', user)

		return user
	}
}
