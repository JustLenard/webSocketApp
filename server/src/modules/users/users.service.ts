import { Inject, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from '../../utils/entities/user.entity'
import { GatewaySessionManager } from '../socket/socket.sessions'
import { IShortUser } from 'src/utils/types/interfaces'

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(UserEntity) private userRepostiry: Repository<UserEntity>,
		@Inject(GatewaySessionManager) private sessions: GatewaySessionManager,
	) {}
	private logger = new Logger('Users service')

	async findAll(): Promise<IShortUser[]> {
		this.logger.log(`Getting users`)
		const users = await this.userRepostiry.find()

		return users.map((user) => ({
			id: user.id,
			username: user.username,
			online: this.getOnlineStatus(user),
		}))
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
}
