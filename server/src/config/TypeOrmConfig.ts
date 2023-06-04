import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { RoomEntity } from 'src/modules/chat/entities/room.entity'
import { User } from 'src/modules/users/entities/user.entity'

export const typeOrm: TypeOrmModuleOptions = {
	type: 'postgres',
	host: 'localhost',
	port: 5432,
	username: 'postgres',
	password: 'mysecretpassword',
	database: 'Users',
	entities: [User, RoomEntity],
	synchronize: true,
}
