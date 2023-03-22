import { Request, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtGuard, LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req, res): any {
    console.log('This is req', req.body);
    res.cookie('token', 'newToken');
    return this.authService.login(req.body);
  }

  @UseGuards(JwtGuard)
  @Post('u')
  protected(@Request() req): any {
    return req.user;
  }
}
