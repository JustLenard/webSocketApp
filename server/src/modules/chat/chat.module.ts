import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { UsersModule } from '../users/users.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RoomEntity } from './entities/room.entity'
import { ChatGateway } from './chat.gateway'
import { RoomService } from './service/room/room.service'
import { WebsocketEvents } from './chat.event'

@Module({
	imports: [AuthModule, UsersModule, TypeOrmModule.forFeature([RoomEntity])],
	providers: [RoomService, WebsocketEvents, ChatGateway],
})
export class ChatModule {}
