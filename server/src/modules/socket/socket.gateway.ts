import { Injectable, Logger } from '@nestjs/common'
import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { UserEntity } from 'src/utils/entities/user.entity'
import { CreateMessageEvent, JwtPayload } from 'src/utils/types/types'
import { AuthService } from '../auth/auth.service'
import { UsersService } from '../users/users.service'
import { OnEvent } from '@nestjs/event-emitter'
import { socketEvents } from './socketEvents'

@WebSocketGateway({ namespace: '/ws', cors: true })
@Injectable()
export class AppGateWay implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		private authService: AuthService,

		private userService: UsersService,
	) {}

	@WebSocketServer()
	server: Server
	private logger: Logger = new Logger('Chat')

	afterInit(server: Server) {
		console.log('WebSocket server initialized')
	}

	async handleConnection(socket: Socket) {
		try {
			const accesToken = socket.handshake.headers.authorization.replace('Bearer', '').trim()
			const decodedToken: JwtPayload = await this.authService.verifyJwt(accesToken)

			this.logger.log('Looking for user in db')
			const user: UserEntity = await this.userService.findById(decodedToken.sub)

			user.socketId = socket.id
			await user.save()

			console.log('This is user', user)

			if (!user) {
				this.logger.log('User does not exist')
				await this.userService.removeUserSocketId(user.id)
				return this.handleDisconnect(socket)
			} else {
				await this.userService.updateUserSocketId(user.id, socket.id)
				socket.data.user = user
			}
		} catch (err) {
			return this.handleDisconnect(socket)
		}
	}

	handleDisconnect(socket: Socket) {
		console.log('This is socket.data.user', socket.data.user)
		this.userService.removeUserSocketId(socket.data.user.id)
		socket.disconnect()
	}

	/**
	 * Events
	 **/
	@OnEvent('message.create')
	async handleMessageCreate(payload: CreateMessageEvent) {
		const { message, room, user: sender } = payload
		console.log('This is room', room)
		console.log('This is message', message)
		console.log('This is user', sender)

		// 		const newNotification =  this.notifRepository.create({
		// creator: newMessage.user,

		// 		})

		for (const user of room.users) {
			if (user.socketId && user.socketId !== sender.socketId) {
				this.logger.log('Sending message to', user.socketId)
				this.server.to(user.socketId).emit(socketEvents.messageAdded, message)
			}
		}
	}
}
