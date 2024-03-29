import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MessageEntity } from 'src/utils/entities/message.entity'
import { NotificationsEntity } from 'src/utils/entities/notifications.entity'
import { ProfileEntity } from 'src/utils/entities/profile.entity'
import { UserEntity } from 'src/utils/entities/user.entity'
import { ImageStorageModule } from '../image-storage/image-storage.module'
import { NotificationsService } from '../notifications/notifications.service'
import { OpenAiService } from '../open-ai/open-ai.service'
import { RoomsModule } from '../rooms/rooms.module'
import { UsersModule } from '../users/users.module'
import { UsersService } from '../users/users.service'
import { MessageController } from './messages.controller'
import { MessageService } from './messages.service'

@Module({
	imports: [
		TypeOrmModule.forFeature([MessageEntity, UserEntity, NotificationsEntity, ProfileEntity]),
		RoomsModule,
		UsersModule,
		ImageStorageModule,
	],
	controllers: [MessageController],
	providers: [MessageService, UsersService, NotificationsService, OpenAiService],
})
export class MessagesModule {}
