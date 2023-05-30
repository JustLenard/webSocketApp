import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthDto } from './auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tokens } from 'src/types/tokens.types';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(User) private userRepostiry: Repository<User>,
  ) {}

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async getTokens(userId: number, username: string): Promise<Tokens> {
    console.log('This is process.env.SECRET', process.env.SECRET);
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: process.env.SECRET,
          expiresIn: 60 * 15,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: process.env.SECRET,
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);

    console.log('This is accesToken', at);
    console.log('This is rt', rt);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async updateRtHash(userId: number, rt: string) {
    const hash = await this.hashData(rt);

    await this.userRepostiry
      .createQueryBuilder()
      .update(User)
      .set({ refreshToken: hash })
      .where('id = :id', { id: userId })
      .execute();
  }

  async signupLocal(dto: AuthDto): Promise<Tokens> {
    const hash = await this.hashData(dto.password);

    console.log('This is hash', hash);

    const newUser = await this.userRepostiry
      .create({
        username: dto.username,
        password: hash,
        refreshToken: null,
      })
      .save();

    console.log('This is newUser', newUser);

    const tokens = await this.getTokens(newUser.id, newUser.password);
    await this.updateRtHash(newUser.id, tokens.refresh_token);

    console.log('This is tokens', tokens);

    return tokens;
  }

  signinLocal() {}
  logout() {}
  refresh() {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    const users = await this.usersService.findAll();

    console.log('This is users', users);

    console.log('This is user', user);

    if (user && user.password === password) {
      const { username, password, ...rest } = user;
      return rest;
    }
    return null;
  }

  async login(user: User) {
    console.log('This is process.env.SECRET', process.env.SECRET);
    const payload = { name: user.username, id: user.id };

    return {
      acces_token: this.jwtService.sign(payload),
    };
  }
}
