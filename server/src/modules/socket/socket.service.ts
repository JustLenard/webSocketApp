import { Injectable } from '@nestjs/common'
import { Server } from 'socket.io'
import { AuthService } from '../auth/auth.service'
import { RoomService } from '../chat/service/room.service'
import { UsersService } from '../users/users.service'
import { MessageService } from '../chat/service/message.service'
import { JoinedRoomService } from '../chat/service/joinedRoom.service'

@Injectable()
export class SocketService {
	public socket: Server = null

	constructor(
		private authService: AuthService,
		private roomService: RoomService,
		private userService: UsersService,
		private messageService: MessageService,
		private joinedRoomService: JoinedRoomService,

		@InjectRepository(NotificationsEntity)
		private readonly notifRepository: Repository<NotificationsEntity>,
	) {}

	private logger: Logger = new Logger('Chat')

	connections = []

	async handleConnection(client: Socket, server: Server) {
		try {
			const accesToken = client.handshake.headers.authorization.replace('Bearer', '').trim()
			const decodedToken: JwtPayload = await this.authService.verifyJwt(accesToken)

			this.logger.log('Looking for user in db')
			const user: UserEntity = await this.userService.findById(decodedToken.sub)

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

				// console.log('This is connections', this.connections)

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

	async createRoom(client: Socket, room: PostRoomI) {
		return this.roomService.createRoom(room, client.data.user)
	}

	async checkIfPrivateChatExits(firstUserId: string, secondUserId: string) {
		return this.roomService.checkIfPrivateChatExits(firstUserId, secondUserId)
	}

	async onJoinRoom(client: Socket, roomId: number, server: Server) {
		console.log('This is roomId', roomId)
		const messages = await this.messageService.findMessagesForRoom(roomId)
		console.log('This is messages', messages)
		server.to(client.id).emit(socketEvents.messages, messages)
	}

	async onLeaveRoom(socket: Socket) {
		// remove connection from JoinedRooms
		await this.joinedRoomService.deleteBySocketId(socket.id)
	}

	// async onAddMessage(socket: Socket, message: MessageDto, server: Server) {
	// 	console.log('This is message', message)

	// 	const newMessage: MessageEntity = await this.messageService.createMessage({
	// 		user: socket.data.user,
	// 		...message,
	// 	})

	// 	console.log('This is createdMessage', newMessage)

	// 	const room: RoomEntity = await this.roomService.getRoomById(newMessage.room)

	// 	console.log('This is room', room)

	// 	// 		const newNotification =  this.notifRepository.create({
	// 	// creator: newMessage.user,

	// 	// 		})

	// 	console.log('This is room', room)

	// 	for (const user of room.users) {
	// 		server.to(user.socketId).emit(socketEvents.messageAdded, newMessage)
	// 	}

	// 	return newMessage
	// }
}
