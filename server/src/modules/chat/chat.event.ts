import { Server, Socket } from 'socket.io'
import { Injectable, Logger } from '@nestjs/common'
import { UserEntity } from '../users/entities/user.entity'
import { AuthService } from '../auth/auth.service'
import { UsersService } from '../users/users.service'
import { JwtPayload } from 'src/types/jwtPayload.types'
import { RoomService } from './service/room.service'
import { RoomEntity } from './entities/room.entity'
import { SubscribeMessage } from '@nestjs/websockets'
import { MessageService } from './service/message.service'
import { JoinedRoomService } from './service/joinedRoom.service'
import { JoinedRoomEntity } from './entities/joinedRoom.entity'
import { FMessage, JoinedRoomI, MessageI, RoomI } from 'src/types/entities.types'
import { MessageEntity } from './entities/message.entity'
import { PostRoomI } from 'src/types/frontEnd.types'
import { socketEvents } from './socketEvents'

@Injectable()
export class WebsocketEvents {
	constructor(
		private authService: AuthService,
		private roomService: RoomService,
		private userService: UsersService,
		private messageService: MessageService,
		private joinedRoomService: JoinedRoomService,
	) {}

	private logger: Logger = new Logger('Chat')

	connections = []

	async handleConnection(client: Socket, server: Server) {
		try {
			const accesToken = client.handshake.headers.authorization.replace('Bearer', '').trim()
			const decodedToken: JwtPayload = await this.authService.verifyJwt(accesToken)

			this.logger.log('Looking for user in db')
			const user: UserEntity = await this.userService.findOne(decodedToken.sub)

			// user.socketId = client.id
			// user.save()

			if (!user) {
				this.logger.log('User does not exist')
				await this.userService.removeUserSocketId(user.id)
				return this.handleDisconnect(client)
			} else {
				const res = await this.userService.updateUserSocketId(user.id, client.id)

				console.log('This is res', res)

				client.data.user = user

				this.logger.log('Getting all the rooms for the usefr')

				// console.log('This is server', server)
				const f = server.sockets

				// this.connections.some(con => con.id === user.id)
				this.connections.push({
					userId: user.id,
					socketId: client.id,
				})

				console.log('This is connections', this.connections)

				const rooms = await this.roomService.getRoomsForUser(user.id)

				// client.emit('rooms', rooms)
				return server.to(client.id).emit('rooms', rooms)
			}
		} catch (err) {
			console.log('This is err', err)
			return this.handleDisconnect(client)
		}
	}

	handleDisconnect(client: Socket) {
		this.userService.removeUserSocketId(client.data.user.id)
		console.log(`Client ${client.id} disconnected`)
	}

	handleMessage(client: Socket, payload: any, server: Server) {
		console.log(`Received message from client ${client.id}: ${payload}`)
		// server.emit('message', payload);
	}

	async createRoom(client: Socket, room: PostRoomI) {
		return this.roomService.createRoom(room, client.data.user)
	}

	async checkIfPrivateChatExits(firstUserId: number, secondUserId: number) {
		return this.roomService.checkIfPrivateChatExits(firstUserId, secondUserId)
	}

	async onJoinRoom(client: Socket, room: JoinedRoomI, server: Server) {
		const messages = await this.messageService.findMessagesForRoom(room)
		console.log('This is messages', messages)
		// Save Connection to Room
		await this.joinedRoomService.create({ socketId: client.id, user: client.data.user, room })
		// Send last messages from Room to User
		await server.to(client.id).emit('messages', messages)
	}

	async onLeaveRoom(socket: Socket) {
		// remove connection from JoinedRooms
		await this.joinedRoomService.deleteBySocketId(socket.id)
	}

	async onAddMessage(socket: Socket, message: MessageI, server: Server) {
		console.log('This is message', message)

		const createdMessage: MessageI = await this.messageService.create({ user: socket.data.user, ...message })

		console.log('This is createdMessage', createdMessage)

		const room: RoomEntity = await this.roomService.getRoomById(createdMessage.room)

		console.log('This is room', room)

		for (const user of room.users) {
			server.to(user.socketId).emit(socketEvents.messageAdded, createdMessage)
		}

		return createdMessage
	}
}
