import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { UsersModule } from '../users/users.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RoomEntity } from '../../utils/entities/room.entity'
import { RoomService } from './service/room.service'
import { MessageService } from './service/message.service'
import { JoinedRoomService } from './service/joinedRoom.service'
import { MessageEntity } from '../../utils/entities/message.entity'
import { RoomControler } from './controllers/room.controller'
import { UserEntity } from '../../utils/entities/user.entity'
import { MessageController } from './controllers/message.controller'
import { NotificaitonsService } from './service/notificaitons.service'
import { NotificationsEntity } from 'src/utils/entities/notifications.entity'
import { JoinedRoomEntity } from 'src/utils/entities/joinedRoom.entity'

@Module({
	controllers: [RoomControler, MessageController],
	imports: [
		AuthModule,
		UsersModule,
		TypeOrmModule.forFeature([RoomEntity, MessageEntity, JoinedRoomEntity, UserEntity, NotificationsEntity]),
	],
	providers: [RoomService, MessageService, JoinedRoomService, MessageService, NotificaitonsService],
	exports: [RoomService],
})
export class ChatModule {}
