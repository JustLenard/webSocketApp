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
import { AccountType } from 'src/utils/entities/user.entity'
import { createMessageRoomName, createNotifRoomName } from 'src/utils/helpers'
import { BotTypeEvent, CreateMessageEvent, CreateNotificationEvent, CreateRoomEvent } from 'src/utils/types/types'
import { appEmitters, socketEvents } from '../../utils/constants'
import { NotificationsService } from '../notifications/notifications.service'
import { RoomsService } from '../rooms/rooms.service'
import { GatewaySessionManager } from './socket.sessions'
import { AuthenticatedSocket } from 'src/utils/types/interfaces'

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
		private roomService: RoomsService,
		private notifService: NotificationsService,
		@Inject(GatewaySessionManager)
		private readonly sessions: GatewaySessionManager,
	) {}

	@WebSocketServer()
	server: Server
	private logger: Logger = new Logger('WS Gateway')

	/**
	 * Connection Events
	 **/
	async handleConnection(client: AuthenticatedSocket) {
		if (!client.user) return
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
		this.logger.log(`Disconecting client ${client.id}`)
		const userId = client?.user?.id
		if (!userId) return
		this.sessions.removeUserSocket(userId)

		this.server.emit(socketEvents.userDisconnected, {
			id: userId,
			username: client.user.username,
			online: false,
		})
	}

	/**
	 * Message events
	 **/
	@SubscribeMessage(socketEvents.onRoomJoin)
	onConversationJoin(@MessageBody() roomId: number, @ConnectedSocket() client: AuthenticatedSocket) {
		this.logger.log(`${client.user?.id} joined a Conversation of ID: ${roomId}`)
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
		client.to(createMessageRoomName(roomId)).emit(socketEvents.onTypingStart, client.user.username)
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
		this.logger.warn(`Marking notifications for user in the room ${roomId} as read`)
		this.notifService.markNotificationsAsReadForRoom(client.user, roomId)
		return 'ok'
	}

	/**
	 * Internal app events
	 **/
	@OnEvent(appEmitters.botType)
	imitateBotTyping(payload: BotTypeEvent) {
		const userSocket = this.sessions.getUserSocket(payload.userId)
		if (!userSocket) return
		this.server.to(userSocket.id).emit(socketEvents.onTypingStart, payload.botUsername)
	}

	@OnEvent(appEmitters.botStopType)
	imitateBotStopTyping(payload: BotTypeEvent) {
		const userSocket = this.sessions.getUserSocket(payload.userId)
		if (!userSocket) return
		this.server.to(userSocket.id).emit(socketEvents.onTypingStop, payload.botUsername)
	}

	@OnEvent(appEmitters.notificationsCreate)
	handleNotificationCreate(payload: CreateNotificationEvent) {
		this.logger.log(`Sending notification  ${payload.notif.id}: ${payload.notif.message.text}`)
		this.server.to(createNotifRoomName(payload.roomId)).emit(socketEvents.newNotification, payload)
	}

	@OnEvent(appEmitters.messageCreate)
	handleMessageCreate(payload: CreateMessageEvent) {
		this.server.to(createMessageRoomName(payload.roomId)).emit(socketEvents.messageAdded, payload)
	}

	@OnEvent(appEmitters.messagePatch)
	async handleMessageUpdate(payload: CreateMessageEvent) {
		this.server.to(createMessageRoomName(payload.roomId)).emit(socketEvents.messagePatched, payload)
	}

	@OnEvent(appEmitters.messageDelete)
	async handleMessageDelete(payload: CreateMessageEvent) {
		this.logger.log(`Deleting message with id: ${payload.message.id}`)
		const { message, roomId } = payload
		this.server.to(createMessageRoomName(roomId)).emit(socketEvents.messageDeleted, { message, roomId })
	}

	@OnEvent(appEmitters.roomCreate)
	async roomCreate(payload: CreateRoomEvent) {
		const { room, creatorId } = payload
		const recipients = room.users.filter((user) => user.id !== creatorId && user.accountType !== AccountType.bot)

		/**
		 * Find all the sockets with the associated recepient (user)
		 **/
		const recipientSockets: AuthenticatedSocket[] = []
		recipients.forEach((user) => {
			const socket = this.sessions.getUserSocket(user.id)
			if (socket) recipientSockets.push(socket)
		})

		/**
		 * Make the socketets connect to the newly created room
		 **/
		recipientSockets.forEach((socket) => socket.join(createNotifRoomName(room.id)))

		const roomCreatorSocket = this.sessions.getUserSocket(creatorId)
		if (!roomCreatorSocket) return
		this.onConversationJoin(room.id, roomCreatorSocket)
		roomCreatorSocket.join(createNotifRoomName(room.id))

		recipientSockets.forEach((client) => client.emit(socketEvents.createRoom, room))
	}

	@OnEvent(appEmitters.disconnectUser)
	disconnectUser(userId: string) {
		const userSocket = this.sessions.getUserSocket(userId)
		if (userSocket) this.handleDisconnect(userSocket)
	}
}
