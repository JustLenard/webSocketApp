import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserEntity } from './entities/user.entity'
import { ShortUser, UserI } from 'src/types/entities.types'

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

	async findOne(id: string) {
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

	update(id: string, updateUserDto: UpdateUserDto) {
		return `This action updates a #${id} user`
	}

	async updateUserSocketId(userId: string, newSocketId: string) {
		return this.userRepostiry.update(userId, { socketId: newSocketId })
	}

	async removeUserSocketId(userId: string) {
		return this.userRepostiry.update(userId, { socketId: null })
	}

	remove(id: string) {
		return `This action removes a #${id} user`
	}

	async findUser(username: string): Promise<UserEntity | undefined> {
		// return this.users.find((user) => user.username === username);
		// return this.userRepostiry.findBy();
		return
	}
}
