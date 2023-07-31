import { Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { UserEntity } from 'src/utils/entities/user.entity'
import { CreateMessageEvent, CreateRoomEvent, JwtPayload } from 'src/utils/types/types'
import { AuthService } from '../auth/auth.service'
import { UsersService } from '../users/users.service'
import { appEmitters, socketEvents } from '../../utils/constants'
import { AuthenticatedSocket } from 'src/utils/interfaces'

// @WebSocketGateway({ namespace: '/ws', cors: true })
@WebSocketGateway({
	cors: {
		origin: ['http://localhost:5173'],
		credentials: true,
	},
	pingInterval: 10000,
	pingTimeout: 15000,
})
@Injectable()
export class AppGateWay implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(private authService: AuthService, private userService: UsersService) {}

	@WebSocketServer()
	server: Server
	private logger: Logger = new Logger('Chat')

	// afterInit(server: Server) {
	// 	console.log('WebSocket server initialized')
	// }

	async handleConnection(socket: AuthenticatedSocket) {
		console.log('This is socket.user', socket.user)
		// console.log('This is socket.user', socket.user)
		// try {
		// 	const accesToken = socket.handshake.headers.authorization.replace('Bearer', '').trim()
		// 	const decodedToken: JwtPayload = await this.authService.verifyJwt(accesToken)
		// 	this.logger.log('Looking for user in db')
		// 	const user: UserEntity = await this.userService.findById(decodedToken.sub)
		// 	user.socketId = socket.id
		// 	await user.save()
		// 	if (!user) {
		// 		this.logger.log('User does not exist')
		// 		await this.userService.removeUserSocketId(user.id)
		// 		return this.handleDisconnect(socket)
		// 	} else {
		// 		await this.userService.updateUserSocketId(user.id, socket.id)
		// 		socket.user = user
		// 	}
		// } catch (err) {
		// 	return this.handleDisconnect(socket)		f // }
	}

	handleDisconnect(socket: AuthenticatedSocket) {
		this.userService.removeUserSocketId(socket.user.id)
		socket.disconnect()
	}

	/**
	 * Events
	 **/
	@OnEvent(appEmitters.messageCreate)
	async handleMessageCreate(payload: CreateMessageEvent) {
		const { message, room, user: sender } = payload

		// 		const newNotification =  this.notifRepository.create({
		// creator: newMessage.user,

		// 		})

		for (const user of room.users) {
			if (user.socketId && user.socketId !== sender.socketId) {
				this.logger.log('Sending message to', user.socketId)
				this.server.to(user.socketId).emit(socketEvents.messageAdded, { message, roomId: room.id })
			}
		}
	}

	@OnEvent(appEmitters.messageEdit)
	async handleMessageEdit(payload: CreateMessageEvent) {
		const { message, room, user: sender } = payload
		console.log('This is message', message)
		for (const user of room.users) {
			if (user.socketId && user.socketId !== sender.socketId) {
				this.logger.log('Sending message to', user.socketId)
				this.server.to(user.socketId).emit(socketEvents.messagePatched, { message, roomId: room.id })
			}
		}
	}
	@OnEvent(appEmitters.messageDelete)
	async handleMessageDelete(payload: CreateMessageEvent) {
		const { message, room, user: sender } = payload
		console.log('This is message', message)
		console.log('This is room', room)

		for (const user of room.users) {
			if (user.socketId && user.socketId !== sender.socketId) {
				this.logger.log('Sending message to', user.socketId)
				this.server.to(user.socketId).emit(socketEvents.messageDeleted, { message, roomId: room.id })
			}
		}
	}

	@OnEvent(appEmitters.roomCreate)
	async roomCreate(payload: CreateRoomEvent) {
		const { room, creatorId } = payload

		for (const user of room.users) {
			if (user.socketId && user.id !== creatorId) {
				this.logger.log('Sending message to', user.socketId)
				this.server.to(user.socketId).emit(socketEvents.createRoom, room)
			}
		}
	}
}
