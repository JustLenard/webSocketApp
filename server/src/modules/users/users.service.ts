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

	async findOne(id: number) {
		return await this.userRepostiry.findOneBy({ id })
	}

	async whoAmI(id: number) {
		const user = await this.userRepostiry.findOneBy({ id })
		return {
			id: user.id,
			username: user.username,
		}
	}

	async findByUsername(username: string) {
		return this.userRepostiry.findOneBy({ username })
	}

	update(id: number, updateUserDto: UpdateUserDto) {
		return `This action updates a #${id} user`
	}

	remove(id: number) {
		return `This action removes a #${id} user`
	}

	private readonly users = [
		{
			userId: 1,
			username: 'john',
			password: 'changeme',
		},
		{
			userId: 2,
			username: 'maria',
			password: 'guess',
		},
	]

	async findUser(username: string): Promise<UserEntity | undefined> {
		// return this.users.find((user) => user.username === username);
		// return this.userRepostiry.findBy();
		return
	}
}
