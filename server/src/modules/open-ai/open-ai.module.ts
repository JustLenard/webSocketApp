import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MessageEntity } from 'src/utils/entities/message.entity'
import { NotificationsEntity } from 'src/utils/entities/notifications.entity'
import { MessageService } from '../messages/messages.service'
import { NotificationsService } from '../notifications/notifications.service'
import { RoomsModule } from '../rooms/rooms.module'
import { OpenAiService } from './open-ai.service'
import { ImageStorageModule } from '../image-storage/image-storage.module'

@Module({
	imports: [TypeOrmModule.forFeature([MessageEntity, NotificationsEntity]), RoomsModule, ImageStorageModule],
	providers: [MessageService, NotificationsService, OpenAiService],
})
export class OpenAiModule {}
