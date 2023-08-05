import { Global, Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { UsersModule } from '../users/users.module'
import { AppGateWay } from './socket.gateway'
import { WebsocketAdapter } from './socket.adapter'
import { UserEntity } from 'src/utils/entities/user.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GatewaySessionManager } from './socket.sessions'

@Global()
@Module({
	controllers: [],
	providers: [AppGateWay, GatewaySessionManager],
	imports: [TypeOrmModule.forFeature([UserEntity]), AuthModule, UsersModule],
	exports: [GatewaySessionManager],
})
export class SocketModule {}
