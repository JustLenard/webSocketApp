import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepostiry: Repository<User>,
  ) {}

  async create(user: CreateUserDto) {
    console.log('This is createUserDto', user);
    console.log('This is userRepostiry', this.userRepostiry);
    return await this.userRepostiry.save(user);
    // return this.userRepostiry.find();
  }

  findAll(): Promise<User[]> {
    return this.userRepostiry.find();
  }

  findOne(id: number) {
    return this.userRepostiry.findOneBy({ id: id });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
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
  ];

  async findUser(username: string): Promise<User | undefined> {
    // return this.users.find((user) => user.username === username);
    // return this.userRepostiry.findBy()
    return;
  }
}
