import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from './entities/user.entity'

@Module({
	controllers: [UsersController],
	imports: [TypeOrmModule.forFeature([UserEntity])],
	providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule {}
