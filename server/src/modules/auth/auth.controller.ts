import { Res, Body, Controller, Post, UseGuards, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtGuard, LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: any,
  ): Promise<any> {
    console.log('This is req', req.cookies);

    const token = await this.authService.login(body);
    console.log('This is token', token);

    res.cookie('token', token.acces_token);

    return res.send({
      message: 'Logged in successfully',
      token: token.acces_token,
    });
  }

  @UseGuards(JwtGuard)
  @Post('protected')
  protected(@Req() req: Request): any {
    return req.user;
  }
}
