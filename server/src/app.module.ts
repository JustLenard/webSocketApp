import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { typeOrm } from './config/TypeOrmConfig'
import { AuthModule } from './modules/auth/auth.module'
import { ChatModule } from './modules/chat/chat.module'
import { OpenAiModule } from './modules/open-ai/open-ai.module'
import { SocketModule } from './modules/socket/socket.module'
import { UsersModule } from './modules/users/users.module'
import { MessagesModule } from './modules/messages/messages.module';
import { RoomsModule } from './modules/rooms/rooms.module';

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
		SocketModule,
		MessagesModule,
		RoomsModule,
	],
})
export class AppModule {
	constructor(private dataSource: DataSource) {}
}
