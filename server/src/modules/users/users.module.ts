import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from '../../utils/entities/user.entity'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { ProfileEntity } from 'src/utils/entities/profile.entity'
import { ImageStorageModule } from '../image-storage/image-storage.module'

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity, ProfileEntity]), ImageStorageModule],
	controllers: [UsersController],
	providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule {}
