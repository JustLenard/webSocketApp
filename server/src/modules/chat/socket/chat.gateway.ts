import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Injectable, UseGuards } from '@nestjs/common'
import { WebsocketEvents } from './chat.event'
import { identity } from 'rxjs'
import { AtGuard } from 'src/common/guards/at.guard'
import { RoomEntity } from '../entities/room.entity'
import { MessageEntity } from '../entities/message.entity'
import { JoinedRoomI, MessageI, RoomI } from 'src/types/entities.types'
import { socketEvents } from './socketEvents'
import { PostRoomI } from 'src/types/frontEnd.types'

@WebSocketGateway({ namespace: '/ws', cors: true })
@Injectable()
export class ChatGateway {
	constructor(private readonly events: WebsocketEvents) {}

	messages = []

	@WebSocketServer()
	server: Server

	afterInit(server: Server) {
		console.log('WebSocket server initialized')
	}

	@SubscribeMessage('events')
	handleEvent(@MessageBody() data: string, @ConnectedSocket() client: Socket): string {
		console.log('This is data', data)
		return data
	}

	@SubscribeMessage('sendMessage')
	receiveMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket): any {
		this.messages.push(data)
		console.log('This is data', data)
		this.server.emit('message', 'from backend')

		return data
	}

	handleConnection(client: Socket) {
		client.send(this.messages)
		return this.events.handleConnection(client, this.server)
	}

	handleDisconnect(client: Socket) {
		return this.events.handleDisconnect(client)
	}

	handleMessage(client: Socket, payload: any) {
		return this.events.handleMessage(client, payload, this.server)
	}

	@SubscribeMessage(socketEvents.createRoom)
	createRoom(client: Socket, room: PostRoomI) {
		return this.events.createRoom(client, room)
	}

	@SubscribeMessage(socketEvents.checkIfPrivateChatExists)
	checkIfPrivateChatExits(client: Socket, secondUserId: string) {
		return this.events.checkIfPrivateChatExits(client.data.user.id, secondUserId)
	}

	@SubscribeMessage(socketEvents.getMessagesForRoom)
	async onJoinRoom(socket: Socket, roomId: number) {
		return this.events.onJoinRoom(socket, roomId, this.server)
	}

	@SubscribeMessage('leaveRoom')
	async onLeaveRoom(socket: Socket) {
		return this.events.onLeaveRoom(socket)
	}

	@SubscribeMessage(socketEvents.addMessage)
	async onAddMessage(socket: Socket, message: MessageI) {
		return this.events.onAddMessage(socket, message, this.server)
	}
}
