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
import { CreateMessageEvent, CreateNotificationEvent, CreateRoomEvent } from 'src/utils/types/types'
import { appEmitters, socketEvents } from '../../utils/constants'
import { AuthService } from '../auth/auth.service'
import { UsersService } from '../users/users.service'
import { GatewaySessionManager } from './socket.sessions'
import { RoomsService } from '../rooms/rooms.service'
import { NotificationsService } from '../notifications/notifications.service'
import { createMessageRoomName, createNotifRoomName } from 'src/utils/helpers'

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
		// private authService: AuthService,
		// private userService: UsersService,
		private roomService: RoomsService,
		private notifService: NotificationsService,

		@Inject(GatewaySessionManager)
		private readonly sessions: GatewaySessionManager,
	) {}

	@WebSocketServer()
	server: Server
	private logger: Logger = new Logger('Chat')

	/**
	 * Connection Events
	 **/
	async handleConnection(client: AuthenticatedSocket) {
		const userRoomNames = (await this.roomService.getRoomsForUser(client.user.id)).map((room) =>
			createNotifRoomName(room.id),
		)

		client.join(userRoomNames)

		this.logger.log(`New client connected ${client.id}`)
		this.sessions.setUserSocket(client.user.id, client)

		this.server.emit(socketEvents.userConnected, {
			id: client.user.id,
			username: client.user.username,
			online: true,
		})
	}

	handleDisconnect(client: AuthenticatedSocket) {
		// this.userService.removeUserSocketId(client.user.id)
		this.logger.log(`Disconecting client ${client.id}`)
		this.sessions.removeUserSocket(client.user.id)

		this.server.emit(socketEvents.userDisconnected, {
			id: client.user.id,
			username: client.user.username,
			online: false,
		})
	}

	/**
	 * Message events
	 **/
	@SubscribeMessage(socketEvents.onRoomJoin)
	onConversationJoin(@MessageBody() roomId: number, @ConnectedSocket() client: AuthenticatedSocket) {
		console.log(`${client.user?.id} joined a Conversation of ID: ${roomId}`)
		client.join(createMessageRoomName(roomId))
		client.to(createMessageRoomName(roomId)).emit(socketEvents.onRoomJoin)
	}

	@SubscribeMessage(socketEvents.onRoomLeave)
	onConversationLeave(@MessageBody() roomId: number, @ConnectedSocket() client: AuthenticatedSocket) {
		client.leave(createMessageRoomName(roomId))
		client.to(createMessageRoomName(roomId)).emit(socketEvents.onRoomLeave)
	}

	@SubscribeMessage(socketEvents.onTypingStart)
	onTypingStart(@MessageBody() roomId: number, @ConnectedSocket() client: AuthenticatedSocket) {
		client.to(createMessageRoomName(roomId)).emit(socketEvents.onTypingStart)
	}

	@SubscribeMessage(socketEvents.onTypingStop)
	onTypingStop(@MessageBody() roomId: number, @ConnectedSocket() client: AuthenticatedSocket) {
		client.to(createMessageRoomName(roomId)).emit(socketEvents.onTypingStop)
	}

	/**
	 * Notification Events
	 **/
	@SubscribeMessage(socketEvents.markNotificationsAsRead)
	markNotificationsAsRead(@MessageBody() roomId: number, @ConnectedSocket() client: AuthenticatedSocket) {
		this.notifService.markNotificationsAsReadForRoom(client.user, roomId)
		return 'ok'
	}

	/**
	 * Internal app events
	 **/
	@OnEvent(appEmitters.notificationsCreate)
	hadnleNotificationCreate(payload: CreateNotificationEvent) {
		this.server.to(createNotifRoomName(payload.roomId)).emit(socketEvents.newNotification, payload)
	}

	@OnEvent(appEmitters.messageCreate)
	handleMessageCreate(payload: CreateMessageEvent) {
		const { message, roomId } = payload

		this.server.to(createMessageRoomName(roomId)).emit(socketEvents.messageAdded, payload)
	}

	@OnEvent(appEmitters.messagePatch)
	async handleMessageUpdate(payload: CreateMessageEvent) {
		const { message, roomId } = payload
		this.server.to(createMessageRoomName(roomId)).emit(socketEvents.messagePatched, payload)
	}

	@OnEvent(appEmitters.messageDelete)
	async handleMessageDelete(payload: CreateMessageEvent) {
		this.logger.log(`Deleting message with id: ${payload.message.id}`)

		const { message, roomId } = payload

		this.server.to(createMessageRoomName(roomId)).emit(socketEvents.messageDeleted, { message, roomId })
		// this.server.to(createMessageRoomName(roomId))
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
		console.log('This is room', room)

		const recipients = room.users.filter((user) => user.id !== creatorId)
		console.log('This is recipients', recipients)

		const recipientSockets = recipients.map((user) => this.sessions.getUserSocket(user.id))
		console.log('This is recipientSockets', recipientSockets)
		recipientSockets.forEach((client) => client.emit(socketEvents.createRoom, room))

		console.log('This is recipientSockets', recipientSockets)

		// for (const user of room.users) {
		// 	if (user.socketId && user.id !== creatorId) {
		// 		this.logger.log('Sending message to', user.socketId)
		// 		this.server.to(user.socketId).emit(socketEvents.createRoom, room)
		// 	}
		// }
	}
}
