import { Controller, Get, UseGuards } from '@nestjs/common'
import { GetCurrentUser } from 'src/common/decorators/getCurrentUser.decorator'
import { AtGuard } from 'src/common/guards/at.guard'
import { Routes } from 'src/utils/constants'
import { UserEntity } from 'src/utils/entities/user.entity'
import { NotificationsService } from './notifications.service'

@Controller(Routes.noitificaitons)
export class NotificationsController {
	constructor(private readonly notificationsService: NotificationsService) {}

	@UseGuards(AtGuard)
	@Get()
	getUserNotifications(@GetCurrentUser() user: UserEntity) {
		return this.notificationsService.getUserNotifications(user)
	}
}
