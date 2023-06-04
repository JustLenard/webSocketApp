import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Injectable, UseGuards } from '@nestjs/common'
import { WebsocketEvents } from './chat.event'
import { identity } from 'rxjs'
import { AtGuard } from 'src/common/guards/at.guard'
import { RoomEntity } from './entities/room.entity'

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
		this.events.handleConnection(client, this.server)
	}

	handleDisconnect(client: Socket) {
		this.events.handleDisconnect(client)
	}

	handleMessage(client: Socket, payload: any) {
		this.events.handleMessage(client, payload, this.server)
	}

	@SubscribeMessage('createRoom')
	createRoom(client: Socket, room: RoomEntity) {
		this.events.createRoom(client, room)
	}
}
