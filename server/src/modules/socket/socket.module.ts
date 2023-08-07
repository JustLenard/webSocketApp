import { Global, Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { UsersModule } from '../users/users.module'
import { AppGateWay } from './socket.gateway'
import { WebsocketAdapter } from './socket.adapter'
import { UserEntity } from 'src/utils/entities/user.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GatewaySessionManager } from './socket.sessions'
import { RoomsService } from '../rooms/rooms.service'
import { RoomEntity } from 'src/utils/entities/room.entity'
import { NotificationsEntity } from 'src/utils/entities/notifications.entity'
import { NotificationsService } from '../notifications/notifications.service'

@Global()
@Module({
	controllers: [],
	providers: [AppGateWay, GatewaySessionManager, RoomsService, NotificationsService],
	imports: [TypeOrmModule.forFeature([UserEntity, RoomEntity, NotificationsEntity])],
	exports: [GatewaySessionManager],
})
export class SocketModule {}
