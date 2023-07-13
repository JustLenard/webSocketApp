import { Module, Global } from '@nestjs/common'
import { SocketService } from './socket.service'
import { WebSocketGateway } from '@nestjs/websockets'
import { AppGateway } from './socket.gateway'

@Global()
@Module({
	controllers: [],
	providers: [SocketService, AppGateway],
	exports: [SocketService],
})
export class SocketModule {}
