import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { typeOrm } from './config/TypeOrmConfig'
import { AuthModule } from './modules/auth/auth.module'
import { MessagesModule } from './modules/messages/messages.module'
import { OpenAiModule } from './modules/open-ai/open-ai.module'
import { RoomsModule } from './modules/rooms/rooms.module'
import { SocketModule } from './modules/socket/socket.module'
import { UsersModule } from './modules/users/users.module'
import { EventEmitterModule } from '@nestjs/event-emitter'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		EventEmitterModule.forRoot(),
		TypeOrmModule.forRoot(typeOrm),
		UsersModule,
		AuthModule,
		OpenAiModule,
		SocketModule,
		MessagesModule,
		RoomsModule,
	],
})
export class AppModule {
	constructor(private dataSource: DataSource) {}
}
