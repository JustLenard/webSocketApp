import { Module } from '@nestjs/common'
import { RoomControler } from './rooms.controller'
import { RoomsService } from './rooms.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RoomEntity } from 'src/utils/entities/room.entity'
import { MessageEntity } from 'src/utils/entities/message.entity'
import { JoinedRoomEntity } from 'src/utils/entities/joinedRoom.entity'
import { UserEntity } from 'src/utils/entities/user.entity'
import { NotificationsEntity } from 'src/utils/entities/notifications.entity'

@Module({
	imports: [TypeOrmModule.forFeature([RoomEntity, MessageEntity, JoinedRoomEntity, UserEntity, NotificationsEntity])],
	controllers: [RoomControler],
	providers: [RoomsService],
	exports: [RoomsService],
})
export class RoomsModule {}
