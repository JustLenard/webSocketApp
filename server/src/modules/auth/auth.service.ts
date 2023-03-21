import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);

    if (user && user.password === password) {
      const { username, password, ...rest } = user;
      return rest;
    }

    return null;
  }

  async login(user: User) {
    console.log('This is process.env.SECRET', process.env.SECRET);
    const payload = { name: user.password, id: user.id };

    return {
      acces_token: this.jwtService.sign(payload),
    };
  }
}
