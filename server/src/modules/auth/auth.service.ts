import { BadRequestException, ConflictException, ForbiddenException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import * as argon2 from 'argon2'
import { Tokens } from 'src/types/tokens.types'
import { Repository } from 'typeorm'
import { UserEntity } from '../users/entities/user.entity'
import { UsersService } from '../users/users.service'
import { AuthDto } from './auth.dto'
import { Response } from 'express'
import { RoomService } from '../chat/service/room.service'
import { RoomEntity } from '../chat/entities/room.entity'

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private jwtService: JwtService,
		@InjectRepository(UserEntity) private userRepostiry: Repository<UserEntity>,
		@InjectRepository(RoomEntity) private roomRepository: Repository<RoomEntity>,
	) {}

	alphabet = [...Array(26)].map((_, i) => (i + 10).toString(36))
	numbers = [...Array(10)].map((_, i) => i.toString())

	hashData(data: string) {
		return argon2.hash(data)
	}

	async getTokens(userId: string, username: string): Promise<Tokens> {
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
					// expiresIn: 5,
				},
			),
		])

		return {
			accessToken: at,
			refreshToken: rt,
		}
	}

	async updateRtHash(userId: string, rt: string) {
		const hash = await this.hashData(rt)

		await this.userRepostiry
			.createQueryBuilder()
			.update(UserEntity)
			.set({ refreshToken: hash })
			.where('id = :id', { id: userId })
			.execute()
	}

	async signupLocal(dto: AuthDto): Promise<Tokens> {
		/**
		 * Enforce unique username
		 **/
		if (await this.userRepostiry.findOneBy({ username: dto.username }))
			throw new ConflictException('Username is already taken')

		/**
		 * Enforce strong password
		 **/
		const passIsOk = this.passwordIsOk(dto.password)
		if (!passIsOk)
			throw new BadRequestException(
				'Password should have at least 6 characters and contain at least one letter and number',
			)

		const hash = await this.hashData(dto.password)

		this.userRepostiry.create({})

		const globalRoom = await this.roomRepository.findOne({
			where: { name: 'Global' },
		})

		console.log('This is globalRoom', globalRoom)

		const newUser = await this.userRepostiry
			.create({
				username: dto.username,
				password: hash,
				// rooms: [globalRoom],
			})
			.save()

		console.log('This is newUser', newUser)

		const tokens = await this.getTokens(newUser.id, newUser.username)
		await this.updateRtHash(newUser.id, tokens.refreshToken)

		return tokens
	}

	async signinLocal(dto: AuthDto, res: Response): Promise<Tokens> {
		const user = await this.userRepostiry.findOne({
			where: { username: dto.username },
		})
		if (!user) throw new ForbiddenException('Username and password mismatch')

		const passwordMatches = await argon2.verify(user.password, dto.password)

		if (!passwordMatches) throw new ForbiddenException('Username and password mismatch')

		const tokens = await this.getTokens(user.id, user.username)
		await this.updateRtHash(user.id, tokens.refreshToken)

		this.setCookie(res, tokens.refreshToken)

		return tokens
	}

	async logout(userId: string) {
		await this.userRepostiry.update(
			{
				id: userId,
			},
			{
				refreshToken: null,
			},
		)
	}

	async refresh(userId: string, rt: string, res: Response) {
		const user = await this.userRepostiry.findOne({
			where: {
				id: userId,
			},
		})

		// console.log('This is user', user)
		// console.log('pas 0')
		// console.log('This is user.refreshToken', user.refreshToken)
		if (!user || !user.refreshToken) throw new ForbiddenException('Access Denied')
		console.log('pas 1')

		const rtMatches = await argon2.verify(user.refreshToken, rt)

		if (!rtMatches) throw new ForbiddenException('Access Denied')
		console.log('pas 2')

		const tokens = await this.getTokens(user.id, user.username)
		await this.updateRtHash(user.id, tokens.refreshToken)

		// res.cookie('refreshToken', tokens.refreshToken, {
		// 	httpOnly: true,
		// 	secure: false,
		// 	domain: 'localhost',
		// })

		this.setCookie(res, tokens.refreshToken)

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

	async setCookie(res: Response, value: string, cookieName = 'refreshToken') {
		return res.cookie(cookieName, value, {
			httpOnly: true,
			secure: false,
			domain: 'localhost',
			sameSite: 'strict',
		})
	}

	verifyJwt(jwt: string): Promise<any> {
		return this.jwtService.verifyAsync(jwt, {
			secret: process.env.ACCESS_TOKEN_SECRET,
		})
	}

	passwordIsOk(pass: string): boolean {
		let lengthCheck = false
		let numberCheck = false
		let letterCheck = false

		lengthCheck = pass.length > 5

		pass.toLowerCase()
			.split('')
			.forEach((letter) => {
				if (this.numbers.includes(letter)) {
					numberCheck = true
				}

				if (this.alphabet.includes(letter)) {
					letterCheck = true
				}
			})
		return lengthCheck && numberCheck && letterCheck
	}
}
