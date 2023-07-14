import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { JoinedRoomEntity } from 'src/utils/entities/joinedRoom.entity'
import { MessageEntity } from 'src/utils/entities/message.entity'
import { NotificationsEntity } from 'src/utils/entities/notifications.entity'
import { RoomEntity } from 'src/utils/entities/room.entity'
import { UserEntity } from 'src/utils/entities/user.entity'

export const typeOrm: TypeOrmModuleOptions = {
	type: 'postgres',
	host: 'localhost',
	port: 5432,
	username: 'postgres',
	password: 'mysecretpassword',
	database: 'Users',
	entities: [UserEntity, RoomEntity, MessageEntity, JoinedRoomEntity, NotificationsEntity],
	synchronize: true,
}
