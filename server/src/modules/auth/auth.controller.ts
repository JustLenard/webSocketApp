import { Request, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Request() req): any {
    console.log('This is req', req.body);
    return this.authService.login(req.body);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  protected(@Request() req): any {
    return 'passed';
  }
}
