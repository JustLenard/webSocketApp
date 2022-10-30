import { Server as HTTPServer } from 'http'
import { Socket, Server } from 'socket.io'
import { v4 } from 'uuid'

export class ServerSocket {
	public static instance: ServerSocket
	public io: Server

	// Master list of all connected users
	public users: { [uid: string]: string }

	constructor(server: HTTPServer) {
		ServerSocket.instance = this
		this.users = {}
		this.io = new Server(server, {
			serveClient: false,
			pingInterval: 100,
			pingTimeout: 5000,
			cookie: false,
			cors: {
				origin: '*',
			},
		})
		this.io.on('connect', this.StartListeners)

		console.log('Socket IO started')
	}

	StartListeners = (socket: Socket) => {
		console.info('Message was received from ' + socket.id)

		socket.on('handshake', () => {
			console.info('Handshake was received from ' + socket.id)
		})

		socket.on('disconnect', () => {
			console.info('Disconnect was received from ' + socket.id)
		})
	}
}
