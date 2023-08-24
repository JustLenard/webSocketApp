import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { NotificationsEntity } from 'src/utils/entities/notifications.entity'
import { RoomEntity } from 'src/utils/entities/room.entity'
import { UserEntity } from 'src/utils/entities/user.entity'
import { NotificationsService } from '../notifications/notifications.service'
import { RoomsModule } from '../rooms/rooms.module'
import { AppGateWay } from './socket.gateway'
import { GatewaySessionManager } from './socket.sessions'

@Global()
@Module({
	controllers: [],
	providers: [AppGateWay, GatewaySessionManager, NotificationsService],
	imports: [TypeOrmModule.forFeature([UserEntity, RoomEntity, NotificationsEntity]), RoomsModule],
	exports: [GatewaySessionManager],
})
export class SocketModule {}
