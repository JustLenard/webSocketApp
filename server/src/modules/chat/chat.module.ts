import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { UsersModule } from '../users/users.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RoomEntity } from './entities/room.entity'
import { ChatGateway } from './socket/chat.gateway'
import { RoomService } from './service/room.service'
import { WebsocketEvents } from './socket/chat.event'
import { MessageService } from './service/message.service'
import { JoinedRoomService } from './service/joinedRoom.service'
import { MessageEntity } from './entities/message.entity'
import { JoinedRoomEntity } from './entities/joinedRoom.entity'
import { RoomControler } from './controllers/room.controller'
import { UserEntity } from '../users/entities/user.entity'
import { MessageController } from './controllers/message.controller'
import { NotificaitonsService } from './service/notificaitons.service'
import { NotificationsEntity } from './entities/notifications.entity'

@Module({
	controllers: [RoomControler, MessageController],
	imports: [
		AuthModule,
		UsersModule,
		TypeOrmModule.forFeature([RoomEntity, MessageEntity, JoinedRoomEntity, UserEntity, NotificationsEntity]),
	],
	providers: [
		RoomService,
		WebsocketEvents,
		// ChatGateway,
		MessageService,
		JoinedRoomService,
		MessageService,
		NotificaitonsService,
	],
	exports: [RoomService],
})
export class ChatModule {}
