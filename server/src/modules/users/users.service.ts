import { Inject, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ProfileEntity } from 'src/utils/entities/profile.entity'
import { generateUUIDV4 } from 'src/utils/helpers'
import { IShortUser } from 'src/utils/types/interfaces'
import { UpdateUserProfileParams } from 'src/utils/types/types'
import { Repository } from 'typeorm'
import { UserEntity } from '../../utils/entities/user.entity'
import { ImageStorageService } from '../image-storage/image-storage.service'
import { GatewaySessionManager } from '../socket/socket.sessions'

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
		@InjectRepository(ProfileEntity) private profileRepository: Repository<ProfileEntity>,
		@Inject(GatewaySessionManager) private sessions: GatewaySessionManager,
		@Inject('uploadImages') private readonly imageStorageService: ImageStorageService,
	) {}
	private logger = new Logger('Users service')

	async findAll(): Promise<IShortUser[]> {
		this.logger.log(`Getting users`)
		const users = await this.userRepository.find({
			relations: ['profile'],
		})

		const res = users.map(async (user) => {
			return {
				id: user.id,
				username: user.username,
				online: this.getOnlineStatus(user),
				imageUrl: user.profile?.avatar ? await this.imageStorageService.get(user.profile.avatar) : undefined,
			}
		})

		return await Promise.all(res)
	}

	getOnlineStatus(user: UserEntity) {
		if (user.accountType === 'bot') return true
		const userSocket = this.sessions.getUserSocket(user.id)
		if (userSocket) return true
		return false
	}

	async findById(id: string) {
		return await this.userRepository.findOneBy({ id })
	}

	async whoAmI(id: string) {
		const user = await this.userRepository.findOne({
			where: {
				id: id,
			},
			relations: ['profile'],
		})
		const avatar = user.profile?.avatar
		const avatarUrl = avatar ? await this.imageStorageService.get(avatar) : undefined

		return {
			id: user.id,
			username: user.username,
			profile: {
				avatar: avatarUrl,
			},
		}
	}

	async findByUsername(username: string) {
		return this.userRepository.findOneBy({ username })
	}

	createProfile() {
		const newProfile = this.profileRepository.create()
		return this.profileRepository.save(newProfile)
	}

	async createProfileOrUpdate(user: UserEntity, params: UpdateUserProfileParams) {
		console.log('CreateProfileOrUpdate')
		if (!user.profile) {
			this.logger.log('User has no profile. Creating...')
			user.profile = await this.createProfile()
			return this.updateProfile(user, params)
		}
		this.logger.log('User has profile')
		return this.updateProfile(user, params)
	}

	async updateProfile(user: UserEntity, params: UpdateUserProfileParams) {
		this.logger.log(params)
		if (params.avatar) user.profile.avatar = await this.updateAvatar(params.avatar)
		return this.userRepository.save(user)
	}

	async updateBanner(file: Express.Multer.File) {
		const key = generateUUIDV4()
		await this.imageStorageService.upload({ key, file })
		return key
	}

	async updateAvatar(file: Express.Multer.File) {
		this.logger.log('Updating Avatar')
		const key = generateUUIDV4()
		await this.imageStorageService.upload({ key, file })
		return key
	}
}
