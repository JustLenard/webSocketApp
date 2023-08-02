import { Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'
import { AuthenticatedSocket } from 'src/utils/interfaces'
import { CreateMessageEvent, CreateRoomEvent } from 'src/utils/types/types'
import { appEmitters, socketEvents } from '../../utils/constants'
import { AuthService } from '../auth/auth.service'
import { UsersService } from '../users/users.service'

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

	async handleConnection(socket: AuthenticatedSocket) {
		this.logger.log(`New socket connected ${socket.id}`)
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
