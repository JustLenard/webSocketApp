import { Global, Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { UsersModule } from '../users/users.module'
import { AppGateWay } from './socket.gateway'

@Global()
@Module({
	controllers: [],
	providers: [AppGateWay],
	exports: [],
	imports: [AuthModule, UsersModule],
})
export class SocketModule {}
