import { Module } from '@nestjs/common'
import { MessageService } from './messages.service'
import { MessageController } from './messages.controller'
import { RoomsModule } from '../rooms/rooms.module'
import { UsersModule } from '../users/users.module'
import { UsersService } from '../users/users.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MessageEntity } from 'src/utils/entities/message.entity'
import { UserEntity } from 'src/utils/entities/user.entity'

@Module({
	imports: [TypeOrmModule.forFeature([MessageEntity, UserEntity]), RoomsModule, UsersModule],
	controllers: [MessageController],
	providers: [MessageService, UsersService],
})
export class MessagesModule {}
