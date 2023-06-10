import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserEntity } from './entities/user.entity'

@Injectable()
export class UsersService {
	constructor(@InjectRepository(UserEntity) private userRepostiry: Repository<UserEntity>) {}

	findAll(): Promise<UserEntity[]> {
		return this.userRepostiry.find()
	}

	findOne(id: number) {
		return this.userRepostiry.findOneBy({ id })
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
