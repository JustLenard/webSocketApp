import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../users/entities/user.entity'
import { UsersModule } from '../users/users.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { AtStrategy } from './strategies/at.strategy'
import { RtStrategy } from './strategies/rt.strategy'

@Module({
	imports: [
		ConfigModule.forRoot(),
		PassportModule,
		UsersModule,
		TypeOrmModule.forFeature([User]),
		JwtModule.register({}),
	],
	controllers: [AuthController],
	providers: [AuthService, AtStrategy, RtStrategy],
	exports: [AuthService],
})
export class AuthModule {}
