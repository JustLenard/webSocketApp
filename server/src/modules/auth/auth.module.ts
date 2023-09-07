import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RoomEntity } from '../../utils/entities/room.entity'
import { UserEntity } from '../../utils/entities/user.entity'
import { UsersModule } from '../users/users.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { AtStrategy } from './strategies/at.strategy'
import { RtStrategy } from './strategies/rt.strategy'

@Module({
	imports: [PassportModule, UsersModule, TypeOrmModule.forFeature([UserEntity, RoomEntity]), JwtModule.register({})],
	controllers: [AuthController],
	providers: [AuthService, AtStrategy, RtStrategy],
	exports: [AuthService],
})
export class AuthModule {}
