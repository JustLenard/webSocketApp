import {
	BadRequestException,
	ConflictException,
	ForbiddenException,
	Injectable,
	Logger,
	UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import * as argon2 from 'argon2'
import { In, Repository } from 'typeorm'
import { UserEntity } from '../../utils/entities/user.entity'
import { UsersService } from '../users/users.service'
import { AuthDto } from './auth.dto'
import { Response } from 'express'
import { Mateservice } from '../chat/service/room.service'
import { RoomEntity } from '../../utils/entities/room.entity'
import { RoomI } from 'src/utils/types/entities.types'
import { MessageEntity } from '../../utils/entities/message.entity'
import { alphabet, numbersOneToTen } from 'src/utils/constants'
import { Tokens } from 'src/utils/types/types'

@Injectable()
export class AuthService {
	async onModuleInit() {
		// const newUser = await this.userRepostiry
		// 	.create({
		// 		username: dto.username,
		// 		password: hash,
		// 		// rooms: [globalRoom],
		// 	})
		// 	.save()
		// const globalRoom = await this.roomRepository.findOne({
		// 	where: { name: 'Global' },
		// 	relations: ['users'], // Make sure the users relation is eagerly loaded
		// })
		// const user = await this.userRepostiry.findOneBy({ id: '2faa6629-590e-4f6e-aed5-a164606040df' })
		// globalRoom.users.push(user)
		// globalRoom.messages.push({
		// 	// id: 5,
		// 	text: 'text',
		// 	user: user,
		// } as MessageEntity)
		// // this.roomRepository.update({ id: globalRoom.id }, globalRoom)
		// this.roomRepository.save(globalRoom)
		// console.log('This is globalRoom', globalRoom)
	}

	constructor(
		private usersService: UsersService,

		private jwtService: JwtService,
		@InjectRepository(UserEntity) private userRepostiry: Repository<UserEntity>,
		@InjectRepository(RoomEntity) private roomRepository: Repository<RoomEntity>,
	) {}

	private logger: Logger = new Logger('Chat')

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
		// const hash = await this.hashData(rt)
		const hash = rt
		console.log('This is rt', rt)

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

		const newUser = await this.userRepostiry
			.create({
				username: dto.username,
				password: hash,
				// rooms: [globalRoom],
			})
			.save()

		const globalRoom = await this.roomRepository.findOne({
			where: { name: 'Global' },
			relations: ['users'], // Make sure the users relation is eagerly loaded
		})

		globalRoom.users.push(newUser)

		await this.roomRepository.save(globalRoom)

		console.log('This is globalRoom', globalRoom)

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
		console.log('This is userId', userId)
		this.logger.log('Refreshing token')

		if (!userId) {
			this.logger.error('Userid is bad', userId)
			return
		}
		const user = await this.userRepostiry.findOneBy({
			id: userId,
		})

		console.log('This is user in refresh', user)
		console.log('pas 0')
		// console.log('This is user.refreshToken', user.refreshToken)
		if (!user || !user.refreshToken) throw new ForbiddenException('Access Denied')
		console.log('user exists')

		this.logger.log('Verifying refresh token')
		console.log('user token in db', user.refreshToken)
		console.log('token in request', rt)
		// const rtMatches = await argon2.verify(user.refreshToken, rt)
		const rtMatches = user.refreshToken === rt

		console.log('This is rtMatches', rtMatches)

		if (!rtMatches) throw new UnauthorizedException('Unauthorized')
		this.logger.log('Refresh token matches')

		const tokens = await this.getTokens(user.id, user.username)
		console.log('This is tokens', tokens)
		await this.updateRtHash(user.id, tokens.refreshToken)
		this.logger.log('Tokens updated')

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
				if (numbersOneToTen.includes(letter)) {
					numberCheck = true
				}

				if (alphabet.includes(letter)) {
					letterCheck = true
				}
			})
		return lengthCheck && numberCheck && letterCheck
	}
}
