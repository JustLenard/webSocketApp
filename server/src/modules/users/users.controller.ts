import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common'
import { GetCurrentUser } from 'src/common/decorators/getCurrentUser.decorator'
import { AtGuard } from 'src/common/guards/at.guard'
import { UpdateUserDto } from './dto/update-user.dto'
import { UsersService } from './users.service'
import { UserEntity } from 'src/utils/entities/user.entity'

@Controller('api/users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@UseGuards(AtGuard)
	@Get('/me')
	whoAmI(@GetCurrentUser() user: UserEntity) {
		return this.usersService.whoAmI(user.id)
	}

	@UseGuards(AtGuard)
	@Get()
	findAll(@GetCurrentUser() user: UserEntity) {
		return this.usersService.findAll(user.id)
	}

	@UseGuards(AtGuard)
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.usersService.findById(id)
	}

	@UseGuards(AtGuard)
	@Patch(':id')
	update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.usersService.update(id, updateUserDto)
	}

	@UseGuards(AtGuard)
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.usersService.remove(id)
	}
}
