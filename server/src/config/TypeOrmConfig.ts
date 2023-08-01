import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { JoinedRoomEntity } from 'src/utils/entities/joinedRoom.entity'
import { MessageEntity } from 'src/utils/entities/message.entity'
import { NotificationsEntity } from 'src/utils/entities/notifications.entity'
import { RoomEntity } from 'src/utils/entities/room.entity'
import { UserEntity } from 'src/utils/entities/user.entity'

export default (): TypeOrmModuleOptions => ({
	type: 'postgres',
	host: process.env.PG_HOST,
	port: parseInt(process.env.PG_PORT),
	username: process.env.PG_USERNAME,
	password: process.env.PG_PASSWORD,
	database: process.env.PG_DATABASE,
	entities: [UserEntity, RoomEntity, MessageEntity, JoinedRoomEntity, NotificationsEntity],
	synchronize: true,
})
