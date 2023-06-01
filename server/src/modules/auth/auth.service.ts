import { ForbiddenException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import * as argon2 from 'argon2'
import { Tokens } from 'src/types/tokens.types'
import { Repository } from 'typeorm'
import { User } from '../users/entities/user.entity'
import { UsersService } from '../users/users.service'
import { AuthDto } from './auth.dto'

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private jwtService: JwtService,
		@InjectRepository(User) private userRepostiry: Repository<User>,
	) {}

	hashData(data: string) {
		return argon2.hash(data)
	}

	async getTokens(userId: number, username: string): Promise<Tokens> {
		const [at, rt] = await Promise.all([
			this.jwtService.signAsync(
				{
					sub: userId,
					username,
				},
				{
					secret: process.env.ACCESS_TOKEN_SECRET,
					expiresIn: 60 * 15,
				},
			),
			this.jwtService.signAsync(
				{
					sub: userId,
					username,
				},
				{
					secret: process.env.REFRESH_TOKEN_SECRET,
					expiresIn: 60 * 60 * 24 * 7,
				},
			),
		])

		return {
			access_token: at,
			refresh_token: rt,
		}
	}

	async updateRtHash(userId: number, rt: string) {
		const hash = await this.hashData(rt)

		await this.userRepostiry
			.createQueryBuilder()
			.update(User)
			.set({ refreshToken: hash })
			.where('id = :id', { id: userId })
			.execute()
	}

	async signupLocal(dto: AuthDto): Promise<Tokens> {
		const hash = await this.hashData(dto.password)

		const newUser = await this.userRepostiry
			.create({
				username: dto.username,
				password: hash,
			})
			.save()

		const tokens = await this.getTokens(newUser.id, newUser.username)
		await this.updateRtHash(newUser.id, tokens.refresh_token)

		return tokens
	}

	async signinLocal(dto: AuthDto): Promise<Tokens> {
		const user = await this.userRepostiry.findOne({
			where: { username: dto.username },
		})
		if (!user) throw new ForbiddenException('Access Denied')

		const passwordMatches = await argon2.verify(user.password, dto.password)

		if (!passwordMatches) throw new ForbiddenException('Access Denied')

		const tokens = await this.getTokens(user.id, user.username)
		await this.updateRtHash(user.id, tokens.refresh_token)

		return tokens
	}

	async logout(userId: number) {
		console.log('This is userId', userId)
		await this.userRepostiry.update(
			{
				id: userId,
			},
			{
				refreshToken: null,
			},
		)
	}

	async refresh(userId: number, rt: string) {
		const user = await this.userRepostiry.findOne({
			where: {
				id: userId,
			},
		})

		console.log('This is user', user)
		console.log('This is rt', rt)

		if (!user || !user.refreshToken) throw new ForbiddenException('Access Denied')

		const rtMatches = await argon2.verify(user.refreshToken, rt)

		console.log('This is rtMatches', rtMatches)

		if (!rtMatches) throw new ForbiddenException('Access Denied')

		const tokens = await this.getTokens(user.id, user.username)
		await this.updateRtHash(user.id, tokens.refresh_token)

		return tokens
	}

	async validateUser(username: string, password: string): Promise<any> {
		const user = await this.usersService.findByUsername(username)
		const users = await this.usersService.findAll()

		if (user && user.password === password) {
			const { username, password, ...rest } = user
			return rest
		}
		return null
	}
}

// {
//     "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIzLCJ1c2VybmFtZSI6ImxlbiIsImlhdCI6MTY4NTYyMTA1OSwiZXhwIjoxNjg1NjIxOTU5fQ.HIOnuTNeguw4gqQ70F5bcrM4ggdK5ziJqj_yBqO2r4c",
//     "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIzLCJ1c2VybmFtZSI6ImxlbiIsImlhdCI6MTY4NTYyMTA1OSwiZXhwIjoxNjg2MjI1ODU5fQ.K6lUnyLWAYrpl3pWXO7JdOqD6qD02OthqNG_42X4tiU"
// }
