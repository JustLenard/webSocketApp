import { Module } from '@nestjs/common'
import { NotificationsController } from './notifications.controller'
import { NotificationsService } from './notifications.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { NotificationsEntity } from 'src/utils/entities/notifications.entity'

@Module({
	imports: [TypeOrmModule.forFeature([NotificationsEntity])],
	controllers: [NotificationsController],
	providers: [NotificationsService],
	exports: [NotificationsService],
})
export class NotificationsModule {}
