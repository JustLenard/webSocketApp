import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { JoinedRoomEntity } from 'src/utils/entities/joinedRoom.entity'
import { MessageEntity } from 'src/utils/entities/message.entity'
import { NotificationsEntity } from 'src/utils/entities/notifications.entity'
import { RoomEntity } from 'src/utils/entities/room.entity'
import { UserEntity } from 'src/utils/entities/user.entity'
import { DataSource, DataSourceOptions } from 'typeorm'

// export const dataSourceOptions = (): DataSourceOptions => ({
// 	type: 'postgres',
// 	host: process.env.PG_HOST,
// 	port: parseInt(process.env.PG_PORT),
// 	username: process.env.PG_USERNAME,
// 	password: process.env.PG_PASSWORD,
// 	database: process.env.PG_DATABASE,
// 	// autoLoadEntities: true,
// 	// entities: [UserEntity, RoomEntity, MessageEntity, JoinedRoomEntity, NotificationsEntity],
// 	// entities: [__dirname + '/../dist/utils/entities/*.entity.{js,ts}'],
// 	entities: ['dist/utils/entities/*.entity.js'],
// 	// entities: ['dist/utils/entities/*.entity.js'],

// 	synchronize: true,
// })

export const dataSourceOptions = (): DataSourceOptions => ({
	type: 'postgres',
	host: 'localhost',
	port: 5432,
	username: 'postgres',
	password: 'mysecretpassword',
	database: 'Users',
	// autoLoadEntities: true,
	entities: [UserEntity, RoomEntity, MessageEntity, JoinedRoomEntity, NotificationsEntity],
	// entities: [__dirname + '/../dist/utils/entities/*.entity.{js,ts}'],
	// entities: ['dist/utils/entities/*.entity.js'],
	// entities: ['dist/utils/entities/*.entity.js'],

	synchronize: true,
})

export const dataSource = new DataSource(dataSourceOptions())
