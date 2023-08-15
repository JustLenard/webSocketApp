import { MessageEntity } from 'src/utils/entities/message.entity'
import { NotificationsEntity } from 'src/utils/entities/notifications.entity'
import { RoomEntity } from 'src/utils/entities/room.entity'
import { UserEntity } from 'src/utils/entities/user.entity'
import { DataSource, DataSourceOptions } from 'typeorm'

import * as dotenv from 'dotenv'
dotenv.config()

export const dataSourceOptions = (): DataSourceOptions => {
	return {
		type: 'postgres',
		host: process.env.HOST,
		port: parseInt(process.env.PG_PORT),
		username: process.env.PG_USERNAME,
		password: process.env.PG_PASSWORD,
		database: process.env.PG_DATABASE,
		entities: [UserEntity, RoomEntity, MessageEntity, NotificationsEntity],
		synchronize: true,
		extra: {
			timezone: 'UTC', // Set the appropriate timezone here
		},
	}
}

export const dataSource = new DataSource(dataSourceOptions())
