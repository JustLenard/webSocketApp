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
import { CreateMessageEvent, CreateMessageResponse, CreateRoomEvent } from 'src/utils/types/types'
import { appEmitters, socketEvents } from '../../utils/constants'
import { AuthService } from '../auth/auth.service'
import { UsersService } from '../users/users.service'
import { GatewaySessionManager } from './socket.sessions'

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
	}

	handleDisconnect(socket: AuthenticatedSocket) {
		// this.userService.removeUserSocketId(socket.user.id)
		this.logger.log(`Disconecting socket ${socket.id}`)
		this.sessions.removeUserSocket(socket.user.id)
	}

	// @OnEvent('conversation.create')
	// handleConversationCreateEvent(payload: Conversation) {
	// 	console.log('Inside conversation.create')
	// 	const recipientSocket = this.sessions.getUserSocket(payload.recipient.id)
	// 	if (recipientSocket) recipientSocket.emit('onConversation', payload)
	// }

	@SubscribeMessage(socketEvents.onRoomJoin)
	onConversationJoin(@MessageBody() roomId: number, @ConnectedSocket() client: AuthenticatedSocket) {
		console.log(`${client.user?.id} joined a Conversation of ID: ${roomId}`)
		client.join(`room-${roomId}`)
		console.log(client.rooms)
		client.to(`room-${roomId}`).emit('userJoin')
	}

	@SubscribeMessage(socketEvents.onRoomLeave)
	onConversationLeave(@MessageBody() roomId: number, @ConnectedSocket() client: AuthenticatedSocket) {
		console.log('onConversationLeave')
		client.leave(`room-${roomId}`)
		console.log(client.rooms)
		client.to(`room-${roomId}`).emit('userLeave')
	}

	@SubscribeMessage(socketEvents.onTypingStart)
	onTypingStart(@MessageBody() roomId: number, @ConnectedSocket() client: AuthenticatedSocket) {
		console.log('onTypingStart')
		console.log(roomId)
		console.log(client.rooms)
		client.to(`room-${roomId}`).emit('onTypingStart')
	}

	@SubscribeMessage(socketEvents.onTypingStop)
	onTypingStop(@MessageBody() roomId: number, @ConnectedSocket() client: AuthenticatedSocket) {
		console.log('onTypingStop')
		console.log(roomId)
		console.log(client.rooms)
		client.to(`room-${roomId}`).emit('onTypingStop')
	}

	// @OnEvent('message.delete')
	// async handleMessageDelete(payload) {
	// 	console.log('Inside message.delete')
	// 	console.log(payload)
	// 	const conversation = await this.conversationService.findById(payload.conversationId)
	// 	if (!conversation) return
	// 	const { creator, recipient } = conversation
	// 	const recipientSocket =
	// 		creator.id === payload.userId
	// 			? this.sessions.getUserSocket(recipient.id)
	// 			: this.sessions.getUserSocket(creator.id)
	// 	if (recipientSocket) recipientSocket.emit('onMessageDelete', payload)
	// }

	// @OnEvent('message.update')
	// async handleMessageUpdate(message: Message) {
	// 	const {
	// 		author,
	// 		conversation: { creator, recipient },
	// 	} = message
	// 	console.log(message)
	// 	const recipientSocket =
	// 		author.id === creator.id
	// 			? this.sessions.getUserSocket(recipient.id)
	// 			: this.sessions.getUserSocket(creator.id)
	// 	if (recipientSocket) recipientSocket.emit('onMessageUpdate', message)
	// }

	/**
	 * Events
	 **/

	// @OnEvent(appEmitters.messageCreate)
	// handleMessageCreateEvent(payload: CreateMessageResponse) {
	// 	console.log('Inside message.create')
	// 	const {
	// 		author,
	// 		conversation: { creator, recipient },
	// 	} = payload.message

	// 	const authorSocket = this.sessions.getUserSocket(author.id)
	// 	const recipientSocket =
	// 		author.id === creator.id
	// 			? this.sessions.getUserSocket(recipient.id)
	// 			: this.sessions.getUserSocket(creator.id)

	// 	if (authorSocket) authorSocket.emit('onMessage', payload)
	// 	if (recipientSocket) recipientSocket.emit('onMessage', payload)
	// }

	@OnEvent(appEmitters.messageCreate)
	handleMessageCreate(payload: CreateMessageEvent) {
		const { message, room } = payload

		this.logger.log('Emitting message')

		this.server.to(`room-${room.id}`).emit(socketEvents.messageAdded, { message, roomId: room.id })
	}

	// @OnEvent(appEmitters.messageEdit)
	// async handleMessageEdit(payload: CreateMessageEvent) {
	// 	const { message, room, user: sender } = payload
	// 	console.log('This is message', message)
	// 	for (const user of room.users) {
	// 		if (user.socketId && user.socketId !== sender.socketId) {
	// 			this.logger.log('Sending message to', user.socketId)
	// 			this.server.to(user.socketId).emit(socketEvents.messagePatched, { message, roomId: room.id })
	// 		}
	// 	}
	// }
	// @OnEvent(appEmitters.messageDelete)
	// async handleMessageDelete(payload: CreateMessageEvent) {
	// 	const { message, room, user: sender } = payload

	// 	for (const user of room.users) {
	// 		if (user.socketId && user.socketId !== sender.socketId) {
	// 			this.logger.log('Sending message to', user.socketId)
	// 			this.server.to(user.socketId).emit(socketEvents.messageDeleted, { message, roomId: room.id })
	// 		}
	// 	}
	// }

	// @OnEvent(appEmitters.roomCreate)
	// async roomCreate(payload: CreateRoomEvent) {
	// 	const { room, creatorId } = payload

	// 	for (const user of room.users) {
	// 		if (user.socketId && user.id !== creatorId) {
	// 			this.logger.log('Sending message to', user.socketId)
	// 			this.server.to(user.socketId).emit(socketEvents.createRoom, room)
	// 		}
	// 	}
	// }
}
