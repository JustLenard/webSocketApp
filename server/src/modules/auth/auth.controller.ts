import { Body, Controller, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common'
import { GetCurrentUserData } from 'src/common/decorators/getCurrentUserData.decorator'
import { GetCurrentUser } from 'src/common/decorators/getCurrentUser.decorator'
import { AtGuard } from 'src/common/guards/at.guard'
import { Response } from 'express'
import { RtGuard } from 'src/common/guards/rt.guard'
import { AuthDto } from './auth.dto'
import { AuthService } from './auth.service'
import { UserEntity } from 'src/utils/entities/user.entity'
import { Tokens } from 'src/utils/types/types'
import { Routes } from 'src/utils/constants'

@Controller(Routes.auth)
export class AuthController {
	constructor(private readonly authService: AuthService) {}

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

	@Post('/guest')
	@HttpCode(HttpStatus.OK)
	signinAsGuest(@Res({ passthrough: true }) res: Response): Promise<Tokens> {
		return this.authService.signinAsGuest(res)
	}

	@UseGuards(AtGuard)
	@Post('/logout')
	@HttpCode(HttpStatus.OK)
	logout(@GetCurrentUser() user: UserEntity) {
		return this.authService.logout(user.id)
	}

	@UseGuards(RtGuard)
	@Post('/refresh')
	@HttpCode(HttpStatus.OK)
	async refresh(
		@GetCurrentUserData('refreshTokenFromRequest') refreshToken: string,
		@GetCurrentUser() user: UserEntity,
		@Res({ passthrough: true }) res: Response,
	) {
		return this.authService.refresh(user, refreshToken, res)
	}
}
