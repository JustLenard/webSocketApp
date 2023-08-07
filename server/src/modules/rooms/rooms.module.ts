import { Module } from '@nestjs/common'
import { RoomControler } from './rooms.controller'
import { RoomsService } from './rooms.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RoomEntity } from 'src/utils/entities/room.entity'
import { MessageEntity } from 'src/utils/entities/message.entity'
import { UserEntity } from 'src/utils/entities/user.entity'
import { NotificationsEntity } from 'src/utils/entities/notifications.entity'
import { NotificationsService } from '../notifications/notifications.service'

@Module({
	imports: [TypeOrmModule.forFeature([RoomEntity, MessageEntity, UserEntity, NotificationsEntity])],
	controllers: [RoomControler],
	providers: [RoomsService, NotificationsService],
	exports: [RoomsService],
})
export class RoomsModule {}
