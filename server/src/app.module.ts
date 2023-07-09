import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { typeOrm } from './config/TypeOrmConfig'
import { AuthModule } from './modules/auth/auth.module'
import { OpenAiModule } from './modules/open-ai/open-ai.module'
import { UsersModule } from './modules/users/users.module'
import { WebsocketEvents } from './modules/chat/socket/chat.event'
import { ChatGateway } from './modules/chat/socket/chat.gateway'
import { RoomService } from './modules/chat/service/room.service'
import { ChatModule } from './modules/chat/chat.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		TypeOrmModule.forRoot(typeOrm),
		UsersModule,
		AuthModule,
		OpenAiModule,
		ChatModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {
	constructor(private dataSource: DataSource) {}
}
