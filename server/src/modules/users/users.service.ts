import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ShortUser } from 'src/utils/types/entities.types'
import { Repository } from 'typeorm'
import { UserEntity } from '../../utils/entities/user.entity'
import { GatewaySessionManager } from '../socket/socket.sessions'

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(UserEntity) private userRepostiry: Repository<UserEntity>,
		@Inject(GatewaySessionManager) private sessions: GatewaySessionManager,
	) {}

	async findAll(): Promise<ShortUser[]> {
		const users = await this.userRepostiry.find()
		// users = users.filter((user) => user.id !== userId)

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
