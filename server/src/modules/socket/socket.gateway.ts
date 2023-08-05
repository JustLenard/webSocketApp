import { Inject, Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets'
import { Server } from 'socket.io'
import { AuthenticatedSocket } from 'src/utils/interfaces'
import { CreateMessageEvent, CreateRoomEvent } from 'src/utils/types/types'
import { appEmitters, socketEvents } from '../../utils/constants'
import { AuthService } from '../auth/auth.service'
import { UsersService } from '../users/users.service'
import { GatewaySessionManager } from './socket.sessions'

@WebSocketGateway({
	cors: {
		origin: process.env.ALLOWED_ORIGIN.split(','),
		credentials: true,
	},
	pingInterval: 10000,
	pingTimeout: 15000,
})
@Injectable()
export class AppGateWay implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		private authService: AuthService,
		private userService: UsersService,
		@Inject(GatewaySessionManager)
		private sessions: GatewaySessionManager,
	) {}

	@WebSocketServer()
	server: Server
	private logger: Logger = new Logger('Chat')

	async handleConnection(socket: AuthenticatedSocket) {
		this.logger.log(`New socket connected ${socket.id}`)
		this.sessions.setUserSocket(socket.user.id, socket)

		this.server.emit(socketEvents.userConnected, {
			id: socket.user.id,
			username: socket.user.username,
			online: true,
		})
	}

	handleDisconnect(socket: AuthenticatedSocket) {
		// this.userService.removeUserSocketId(socket.user.id)
		this.logger.log(`Disconecting socket ${socket.id}`)
		this.sessions.removeUserSocket(socket.user.id)

		this.server.emit(socketEvents.userDisconnected, {
			id: socket.user.id,
			username: socket.user.username,
			online: false,
		})
	}

	@SubscribeMessage(socketEvents.onRoomJoin)
	onConversationJoin(@MessageBody() roomId: number, @ConnectedSocket() client: AuthenticatedSocket) {
		console.log(`${client.user?.id} joined a Conversation of ID: ${roomId}`)
		client.join(`room-${roomId}`)
		console.log(client.rooms)
		client.to(`room-${roomId}`).emit('userJoin')
	}

	@SubscribeMessage(socketEvents.onRoomLeave)
	onConversationLeave(@MessageBody() roomId: number, @ConnectedSocket() client: AuthenticatedSocket) {
		client.leave(`room-${roomId}`)
		console.log(client.rooms)
		client.to(`room-${roomId}`).emit('userLeave')
	}

	@SubscribeMessage(socketEvents.onTypingStart)
	onTypingStart(@MessageBody() roomId: number, @ConnectedSocket() client: AuthenticatedSocket) {
		console.log(roomId)
		console.log(client.rooms)
		client.to(`room-${roomId}`).emit('onTypingStart')
	}

	@SubscribeMessage(socketEvents.onTypingStop)
	onTypingStop(@MessageBody() roomId: number, @ConnectedSocket() client: AuthenticatedSocket) {
		console.log(roomId)
		console.log(client.rooms)
		client.to(`room-${roomId}`).emit('onTypingStop')
	}

	/**
	 * Events
	 **/
	@OnEvent(appEmitters.messageCreate)
	handleMessageCreate(payload: CreateMessageEvent) {
		const { message, roomId } = payload

		this.server.to(`room-${roomId}`).emit(socketEvents.messageAdded, { message, roomId })
	}

	@OnEvent(appEmitters.messagePatch)
	async handleMessageUpdate(payload: CreateMessageEvent) {
		const { message, roomId } = payload

		this.server.to(`room-${roomId}`).emit(socketEvents.messagePatched, { message, roomId })
	}

	@OnEvent(appEmitters.messageDelete)
	async handleMessageDelete(payload: CreateMessageEvent) {
		this.logger.log(`Deleting message with id: ${payload.message.id}`)

		const { message, roomId } = payload

		this.server.to(`room-${roomId}`).emit(socketEvents.messageDeleted, { message, roomId })
		// this.server.to(`room-${roomId}`)
	}

	// @OnEvent('conversation.create')
	// handleConversationCreateEvent(payload: Conversation) {
	// 	console.log('Inside conversation.create')
	// 	const recipientSocket = this.sessions.getUserSocket(payload.recipient.id)
	// 	if (recipientSocket) recipientSocket.emit('onConversation', payload)
	// }

	@OnEvent(appEmitters.roomCreate)
	async roomCreate(payload: CreateRoomEvent) {
		const { room, creatorId } = payload

		const recipient = room.users.filter((user) => user.id !== creatorId)

		const recipientSockets = recipient.map((item) => this.sessions.getUserSocket(item.id))
		recipientSockets.forEach((socket) => socket.emit(socketEvents.createRoom, room))

		console.log('This is recipientSockets', recipientSockets)

		// for (const user of room.users) {
		// 	if (user.socketId && user.id !== creatorId) {
		// 		this.logger.log('Sending message to', user.socketId)
		// 		this.server.to(user.socketId).emit(socketEvents.createRoom, room)
		// 	}
		// }
	}
}
