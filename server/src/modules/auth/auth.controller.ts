import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './auth.dto';
import { Tokens } from 'src/types/tokens.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('/signup')
  // async createUser(
  //   @Body('password') password: string,
  //   @Body('username') username: string,
  // ): Promise<User> {
  //   const saltOrRounds = 10;
  //   const hashedPassword = await bcrypt.hash(password, saltOrRounds);
  //   const result = await this.authService.createUser(username, hashedPassword);
  //   return result;
  // }

  @Post('/signup')
  async signupLocal(@Body() dto: AuthDto): Promise<Tokens> {
    return await this.authService.signupLocal(dto);
  }

  @Post('/signin')
  signinLocal() {
    this.authService.signinLocal();
  }

  @Post('/logout')
  logout() {
    this.authService.logout();
  }

  @Post('/refresh')
  refresh() {
    this.authService.refresh();
  }
}
