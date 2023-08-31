import {
	BadRequestException,
	ConflictException,
	ForbiddenException,
	Injectable,
	InternalServerErrorException,
	Logger,
	UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import * as argon2 from 'argon2'
import { Response } from 'express'
import { ALPHABET, GLOBAL_ROOM_NAME, NUMBERS, REFRESH_TOKEN } from 'src/utils/constants'
import { selectRandomArrayElement } from 'src/utils/helpers'
import { Tokens } from 'src/utils/types/types'
import { Repository } from 'typeorm'
import { RoomEntity } from '../../utils/entities/room.entity'
import { AccountType, UserEntity } from '../../utils/entities/user.entity'
import { UsersService } from '../users/users.service'
import { AuthDto } from './auth.dto'

@Injectable()
export class AuthService {
	async onModuleInit() {
		// const botAccounts = await this.userRepository.findOneBy({ accountType: AccountType.bot })
		// if (!botAccounts) {
		// 	this.logger.warn('Creating bot accounts')
		// 	this.signupLocal({})
		// }
	}

	constructor(
		private usersService: UsersService,
		private jwtService: JwtService,
		@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
		@InjectRepository(RoomEntity) private roomRepository: Repository<RoomEntity>,
	) {}

	private logger: Logger = new Logger('Auth Service')

	async getTokens(userId: string, username: string): Promise<Tokens> {
		const [at, rt] = await Promise.all([
			this.jwtService.signAsync(
				{
					sub: userId,
					username,
				},
				{
					secret: process.env.ACCESS_TOKEN_SECRET,
					// expiresIn: 60 * 15,
					expiresIn: 7,
				},
			),
			this.jwtService.signAsync(
				{
					sub: userId,
					username,
				},
				{
					secret: process.env.REFRESH_TOKEN_SECRET,
					expiresIn: 60 * 60 * 24 * 7, // 1 week
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

		await this.userRepository
			.createQueryBuilder()
			.update(UserEntity)
			.set({ refreshToken: hash })
			.where('id = :id', { id: userId })
			.execute()
	}

	async signupLocal(dto: AuthDto, res: Response): Promise<Tokens> {
		/**
		 * Enforce unique username
		 **/
		if (await this.userRepository.findOneBy({ username: dto.username }))
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

		const newUser = await this.userRepository
			.create({
				username: dto.username,
				password: hash,
			})
			.save()

		const globalRoom = await this.roomRepository.findOne({
			where: { name: GLOBAL_ROOM_NAME },
			relations: ['users'], // Make sure the users relation is eagerly loaded
		})

		globalRoom.users.push(newUser)

		await this.roomRepository.save(globalRoom)

		const tokens = await this.getTokens(newUser.id, newUser.username)
		await this.updateRtHash(newUser.id, tokens.refreshToken)
		this.setCookie(res, tokens.refreshToken)

		return tokens
	}

	async signinLocal(dto: AuthDto, res: Response): Promise<Tokens> {
		const user = await this.userRepository.findOne({
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

	async signinAsGuest(res: Response): Promise<Tokens> {
		const guestUsers = await this.userRepository.find({
			where: { accountType: AccountType.guest },
		})

		if (guestUsers.length === 0) throw new InternalServerErrorException('No guest accounts')
		const selectedUser: UserEntity = selectRandomArrayElement(guestUsers)

		const tokens = await this.getTokens(selectedUser.id, selectedUser.username)
		await this.updateRtHash(selectedUser.id, tokens.refreshToken)

		this.setCookie(res, tokens.refreshToken)

		return tokens
	}

	async logout(userId: string) {
		await this.userRepository.update(
			{
				id: userId,
			},
			{
				refreshToken: null,
			},
		)
		return 'ok'
	}

	async refresh(user: UserEntity, rt: string, res: Response) {
		this.logger.log('Refreshing token')

		if (!user || !user.refreshToken) throw new UnauthorizedException('Unauthorized')

		this.logger.log('Verifying refresh token')
		try {
			const rtMatches = await argon2.verify(user.refreshToken, rt)

			if (!rtMatches) throw new UnauthorizedException('Unauthorized')
			this.logger.log('Refresh token matches')
		} catch {
			throw new UnauthorizedException('Unauthorized')
		}
		const tokens = await this.getTokens(user.id, user.username)
		await this.updateRtHash(user.id, tokens.refreshToken)
		this.logger.log('Tokens updated')

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

	async setCookie(res: Response, value: string, cookieName = REFRESH_TOKEN) {
		return res.cookie(cookieName, value, {
			httpOnly: true,
			secure: false,
			domain: process.env.DOMAIN,
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
				if (NUMBERS.includes(letter)) {
					numberCheck = true
				}

				if (ALPHABET.includes(letter)) {
					letterCheck = true
				}
			})
		return lengthCheck && numberCheck && letterCheck
	}

	hashData(data: string) {
		return argon2.hash(data)
	}
}
