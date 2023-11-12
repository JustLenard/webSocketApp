import { Body, Controller, Get, Param, Patch, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { GetCurrentUser } from 'src/common/decorators/getCurrentUser.decorator'
import { AtGuard } from 'src/common/guards/at.guard'
import { Routes, UserProfileFileFields } from 'src/utils/constants'
import { UserEntity } from 'src/utils/entities/user.entity'
import { UpdateUserProfileParams, UserProfileFiles } from 'src/utils/types/types'
import { UpdateUserProfileDto } from './dto/update-user-profile.dto'
import { UsersService } from './users.service'

@Controller(Routes.user)
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@UseGuards(AtGuard)
	@Get('/me')
	whoAmI(@GetCurrentUser() user: UserEntity) {
		return this.usersService.whoAmI(user.id)
	}

	@UseGuards(AtGuard)
	@Patch('/user-profile')
	@UseInterceptors(FileFieldsInterceptor(UserProfileFileFields))
	async updateUserProfile(
		@GetCurrentUser() user: UserEntity,
		@UploadedFiles()
		files: UserProfileFiles,
		@Body() updateUserProfileDto: UpdateUserProfileDto,
	) {
		const params: UpdateUserProfileParams = {
			avatar: files.avatar[0],
		}

		return this.usersService.createProfileOrUpdate(user, params)
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
