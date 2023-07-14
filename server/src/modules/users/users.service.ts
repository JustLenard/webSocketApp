import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserEntity } from '../../utils/entities/user.entity'
import { ShortUser, UserI } from 'src/utils/types/entities.types'

@Injectable()
export class UsersService {
	constructor(@InjectRepository(UserEntity) private userRepostiry: Repository<UserEntity>) {}

	async findAll(): Promise<ShortUser[]> {
		const users = await this.userRepostiry.find()
		return users.map((user) => ({
			id: user.id,
			username: user.username,
		}))
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

	async updateUserSocketId(userId: string, newSocketId: null | string = null) {
		return this.userRepostiry.update(userId, { socketId: newSocketId })
	}

	async removeUserSocketId(userId: string) {
		return this.userRepostiry.update(userId, { socketId: null })
	}

	/**
	 * @todo
	 **/
	update(id: string, updateUserDto: UpdateUserDto) {
		return `This action updates a #${id} user`
	}

	/**
	 * @todo
	 **/
	remove(id: string) {
		return `This action removes a #${id} user`
	}
}
