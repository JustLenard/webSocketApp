import { Body, Controller, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common'
import { GetCurrentUser } from 'src/common/decorators/getCurrentUser.decorator'
import { GetCurrentUserId } from 'src/common/decorators/getCurrentUserId.decorator'
import { AtGuard } from 'src/common/guards/at.guard'
import { Response } from 'express'
import { RtGuard } from 'src/common/guards/rt.guard'
import { Tokens } from 'src/types/tokens.types'
import { AuthDto } from './auth.dto'
import { AuthService } from './auth.service'

@Controller('/api/auth')
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
	@HttpCode(HttpStatus.CREATED)
	async signupLocal(@Body() dto: AuthDto): Promise<Tokens> {
		return await this.authService.signupLocal(dto)
	}

	@Post('/signin')
	@HttpCode(HttpStatus.OK)
	signinLocal(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response): Promise<Tokens> {
		return this.authService.signinLocal(dto, res)
	}

	@UseGuards(AtGuard)
	@Post('/logout')
	@HttpCode(HttpStatus.OK)
	logout(@GetCurrentUserId() userId: number) {
		console.log('This is userId', userId)
		return this.authService.logout(userId)
	}

	@UseGuards(RtGuard)
	@Post('/refresh')
	@HttpCode(HttpStatus.OK)
	refresh(
		@GetCurrentUser('refreshToken') refreshToken: string,
		@GetCurrentUserId() userId: number,
		@Res({ passthrough: true }) res: Response,
	) {
		return this.authService.refresh(userId, refreshToken, res)
	}
}
