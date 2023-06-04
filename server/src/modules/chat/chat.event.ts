import { Server, Socket } from 'socket.io'
import { Injectable, Logger } from '@nestjs/common'
import { User } from '../users/entities/user.entity'
import { AuthService } from '../auth/auth.service'
import { UsersService } from '../users/users.service'
import { JwtPayload } from 'src/types/jwtPayload.types'
import { RoomService } from './service/room/room.service'
import { RoomEntity } from './entities/room.entity'

@Injectable()
export class WebsocketEvents {
	constructor(
		private authService: AuthService,
		private roomService: RoomService,
		private userService: UsersService,
	) {}

	private logger: Logger = new Logger('Chat')

	async handleConnection(client: Socket, server: Server) {
		console.log(`Client ${client.id} connected`)
		try {
			const accesToken = client.handshake.headers.authorization.replace('Bearer', '').trim()
			const decodedToken: JwtPayload = await this.authService.verifyJwt(accesToken)

			console.log('This is decodedToken', decodedToken)
			this.logger.log('Looking for user in db')
			const user: User = await this.userService.findOne(decodedToken.sub)

			console.log('This is user', user)

			if (!user) {
				this.logger.log('User does not exist')
				return this.handleDisconnect(client)
			} else {
				client.data.user = user
				this.logger.log('Getting all the rooms for the user')
				const rooms = await this.roomService.getRoomsForUser(user.id)

				console.log('This is rooms', rooms)

				return server.to(client.id).emit('rooms', rooms)
			}
		} catch (err) {
			console.log('This is err', err)
			return this.handleDisconnect(client)
		}
	}

	handleDisconnect(client: Socket) {
		console.log(`Client ${client.id} disconnected`)
	}

	handleMessage(client: Socket, payload: any, server: Server) {
		console.log(`Received message from client ${client.id}: ${payload}`)
		// server.emit('message', payload);
	}

	async createRoom(client: Socket, room: RoomEntity) {
		return this.roomService.createRoom(room, client.data.user)
	}
}
