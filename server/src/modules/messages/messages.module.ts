import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MessageEntity } from 'src/utils/entities/message.entity'
import { NotificationsEntity } from 'src/utils/entities/notifications.entity'
import { UserEntity } from 'src/utils/entities/user.entity'
import { NotificationsService } from '../notifications/notifications.service'
import { RoomsModule } from '../rooms/rooms.module'
import { UsersModule } from '../users/users.module'
import { UsersService } from '../users/users.service'
import { MessageController } from './messages.controller'
import { MessageService } from './messages.service'

@Module({
	imports: [TypeOrmModule.forFeature([MessageEntity, UserEntity, NotificationsEntity]), RoomsModule, UsersModule],
	controllers: [MessageController],
	providers: [MessageService, UsersService, NotificationsService],
})
export class MessagesModule {}
