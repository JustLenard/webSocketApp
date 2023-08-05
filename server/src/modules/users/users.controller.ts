import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common'
import { GetCurrentUser } from 'src/common/decorators/getCurrentUser.decorator'
import { AtGuard } from 'src/common/guards/at.guard'
import { UpdateUserDto } from './dto/update-user.dto'
import { UsersService } from './users.service'
import { UserEntity } from 'src/utils/entities/user.entity'
import { Routes } from 'src/utils/constants'

@Controller(Routes.user)
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@UseGuards(AtGuard)
	@Get('/me')
	whoAmI(@GetCurrentUser() user: UserEntity) {
		return this.usersService.whoAmI(user.id)
	}

	@UseGuards(AtGuard)
	@Get()
	findAll() {
		return this.usersService.findAll()
	}

	@UseGuards(AtGuard)
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.usersService.findById(id)
	}
}
