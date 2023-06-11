import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { UsersModule } from '../users/users.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RoomEntity } from './entities/room.entity'
import { ChatGateway } from './chat.gateway'
import { RoomService } from './service/room.service'

import { WebsocketEvents } from './chat.event'

import { MessageService } from './service/message.service'
import { JoinedRoomService } from './service/joinedRoom.service'
import { MessageEntity } from './entities/message.entity'

import { JoinedRoomEntity } from './entities/joinedRoom.entity'

@Module({
	imports: [AuthModule, UsersModule, TypeOrmModule.forFeature([RoomEntity, MessageEntity, JoinedRoomEntity])],
	providers: [RoomService, WebsocketEvents, ChatGateway, MessageService, JoinedRoomService, MessageService],
})
export class ChatModule {}
