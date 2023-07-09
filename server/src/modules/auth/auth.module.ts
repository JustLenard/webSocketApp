import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from '../users/entities/user.entity'
import { UsersModule } from '../users/users.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { AtStrategy } from './strategies/at.strategy'
import { RtStrategy } from './strategies/rt.strategy'
import { ChatModule } from '../chat/chat.module'
import { RoomEntity } from '../chat/entities/room.entity'
import { RoomService } from '../chat/service/room.service'

@Module({
	imports: [
		ConfigModule.forRoot(),
		PassportModule,
		UsersModule,
		TypeOrmModule.forFeature([UserEntity, RoomEntity]),
		JwtModule.register({}),
	],
	controllers: [AuthController],
	providers: [AuthService, AtStrategy, RtStrategy],
	exports: [AuthService],
})
export class AuthModule {}
