import { Inject, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from '../../utils/entities/user.entity'
import { GatewaySessionManager } from '../socket/socket.sessions'
import { IShortUser } from 'src/utils/types/interfaces'
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { UpdateUserProfileParams } from 'src/utils/types/types'
import { ProfileEntity } from 'src/utils/entities/profile.entity'

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(UserEntity) private userRepostiry: Repository<UserEntity>,
		@InjectRepository(ProfileEntity) private profileRepository: Repository<ProfileEntity>,
		@Inject(GatewaySessionManager) private sessions: GatewaySessionManager,
	) {}
	private logger = new Logger('Users service')

	async findAll(): Promise<IShortUser[]> {
		this.logger.log(`Getting users`)
		const users = await this.userRepostiry.find({
			relations: ['profile'],
		})

		const { BUCKET_NAME, BUCKET_REGION, ACCESS_KEY, SECRET_ACCESS_KEY } = process.env

		console.log('This is BUCKET_REGION', BUCKET_REGION)
		console.log('This is BUCKET_NAME', BUCKET_NAME)

		const s3 = new S3Client({
			credentials: {
				accessKeyId: ACCESS_KEY,
				secretAccessKey: SECRET_ACCESS_KEY,
			},
			region: BUCKET_REGION,
		})

		const res = users.map(async (user) => {
			let imageUrl

			console.log('This is user.profile', user)

			if (user.profile?.avatar) {
				const command = new GetObjectCommand({
					Bucket: BUCKET_NAME,
					Key: user.profile.avatar,
				})

				imageUrl = await getSignedUrl(s3, command, { expiresIn: 3600 })
				console.log('This is imageUrl', imageUrl)
			}

			return {
				id: user.id,
				username: user.username,
				online: this.getOnlineStatus(user),
				imageUrl: imageUrl,
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
		return await this.userRepostiry.findOneBy({ id })
	}

	async whoAmI(id: string) {
		const user = await this.userRepostiry.findOneBy({ id })
		return {
			id: user.id,
			username: user.username,
		}
	}

	async findByUsername(username: string) {
		return this.userRepostiry.findOneBy({ username })
	}

	async updateOrCreateProfile(user: UserEntity, imageName: string) {
		if (!user.profile) {
			user.profile = await this.createProfile()
			user.profile.avatar = imageName

			this.userRepostiry.save(user)
		}
	}

	createProfile() {
		const newProfile = this.profileRepository.create()
		return this.profileRepository.save(newProfile)
	}
}
