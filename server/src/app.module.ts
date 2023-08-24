import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { dataSourceOptions } from './config/dataSourceOptions'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { AuthModule } from './modules/auth/auth.module'
import { MessagesModule } from './modules/messages/messages.module'
import { OpenAiModule } from './modules/open-ai/open-ai.module'
import { RoomsModule } from './modules/rooms/rooms.module'
import { SocketModule } from './modules/socket/socket.module'
import { UsersModule } from './modules/users/users.module'
import { NotificationsModule } from './modules/notifications/notifications.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [dataSourceOptions],
		}),
		EventEmitterModule.forRoot(),
		TypeOrmModule.forRoot(dataSourceOptions()),
		UsersModule,
		AuthModule,
		OpenAiModule,
		SocketModule,
		MessagesModule,
		RoomsModule,
		NotificationsModule,
	],
})
export class AppModule {
	constructor(private dataSource: DataSource) {}
}
