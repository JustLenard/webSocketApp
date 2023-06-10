import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { JoinedRoomEntity } from 'src/modules/chat/entities/joinedRoom.entity'
import { MessageEntity } from 'src/modules/chat/entities/message.entity'
import { RoomEntity } from 'src/modules/chat/entities/room.entity'
import { UserEntity } from 'src/modules/users/entities/user.entity'

export const typeOrm: TypeOrmModuleOptions = {
	type: 'postgres',
	host: 'localhost',
	port: 5432,
	username: 'postgres',
	password: 'mysecretpassword',
	database: 'Users',
	entities: [UserEntity, RoomEntity, MessageEntity, JoinedRoomEntity],
	synchronize: true,
}
