import { Body, Controller, Get, Param, Patch, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common'
import { GetCurrentUser } from 'src/common/decorators/getCurrentUser.decorator'
import { AtGuard } from 'src/common/guards/at.guard'
import { Routes, UserProfileFileFields } from 'src/utils/constants'
import { UserEntity } from 'src/utils/entities/user.entity'
import { UsersService } from './users.service'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { UpdateUserProfileParams, UserProfileFiles } from 'src/utils/types/types'
import { UpdateUserProfileDto } from './dto/update-user-profile.dto'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

@Controller(Routes.user)
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@UseGuards(AtGuard)
	@Get('/me')
	whoAmI(@GetCurrentUser() user: UserEntity) {
		return this.usersService.whoAmI(user.id)
	}

	// @UseGuards(AtGuard)
	@Patch('/user-profile')
	@UseInterceptors(FileFieldsInterceptor(UserProfileFileFields))
	async updateUserProfile(
		@GetCurrentUser() user: UserEntity,
		@UploadedFiles()
		files: UserProfileFiles,
		@Body() updateUserProfileDto: UpdateUserProfileDto,
	) {
		console.log('Inside Users/Profiles Controller')
		console.log('This is files', files)
		console.log('This is updateUserProfileDto', updateUserProfileDto)

		const { BUCKET_NAME, BUCKET_REGION, ACCESS_KEY, SECRET_ACCESS_KEY } = process.env

		console.log('This is BUCKET_REGION', BUCKET_REGION)
		console.log('This is BUCKET_NAME', BUCKET_NAME)

		const s3 = new S3Client({
			credentials: {
				accessKeyId: ACCESS_KEY,
				secretAccessKey: SECRET_ACCESS_KEY,
			},
			region: BUCKET_REGION,
		})

		console.log('This is files.avatar.filename', files.avatar[0].filename)

		const command = new PutObjectCommand({
			Bucket: BUCKET_NAME,
			Key: 'hardcode',
			// Key: files.avatar[0].originalname,
			Body: files.avatar[0].buffer,
			ContentType: files.avatar[0].mimetype,
		})

		const response = await s3.send(command)
		console.log('This is response', response)

		// const params: UpdateUserProfileParams = {}
		// updateUserProfileDto.username && (params.username = updateUserProfileDto.username)
		// files.avatar && (params.avatar = files.avatar[0])

		// console.log('This is params', params)

		// return this.userProfileService.createProfileOrUpdate(user, params)
	}

	// @UseGuards(AtGuard)
	// @Get('/profile')
	// profile(@GetCurrentUser() user: UserEntity) {
	// 	return this.usersService.whoAmI(user.id)
	// }

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
