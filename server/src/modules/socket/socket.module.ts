import { Global, Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { UsersModule } from '../users/users.module'
import { AppGateWay } from './socket.gateway'
import { WebsocketAdapter } from './socket.adapter'
import { UserEntity } from 'src/utils/entities/user.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Global()
@Module({
	controllers: [],
	providers: [AppGateWay],
	exports: [],
	imports: [TypeOrmModule.forFeature([UserEntity]), AuthModule, UsersModule],
})
export class SocketModule {}
