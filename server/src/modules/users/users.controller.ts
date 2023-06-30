import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { AtGuard } from 'src/common/guards/at.guard'
import { GetCurrentUserId } from 'src/common/decorators/getCurrentUserId.decorator'

@Controller('api/users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@UseGuards(AtGuard)
	@Get('/me')
	whoAmI(@GetCurrentUserId() userId: number) {
		console.log('This is userId', userId)
		return this.usersService.whoAmI(userId)
	}

	@UseGuards(AtGuard)
	@Get()
	findAll() {
		return this.usersService.findAll()
	}

	@UseGuards(AtGuard)
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.usersService.findOne(+id)
	}

	@UseGuards(AtGuard)
	@Patch(':id')
	update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.usersService.update(+id, updateUserDto)
	}

	@UseGuards(AtGuard)
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.usersService.remove(+id)
	}
}
