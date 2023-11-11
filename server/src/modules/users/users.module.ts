import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from '../../utils/entities/user.entity'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { ProfileEntity } from 'src/utils/entities/profile.entity'

@Module({
	controllers: [UsersController],
	imports: [TypeOrmModule.forFeature([UserEntity, ProfileEntity])],
	providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule {}
