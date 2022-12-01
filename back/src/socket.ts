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

		this.getUidFromSocketId(socket.id)

		socket.on('handshake', (callback: (uid: string, users: string[]) => void) => {
			console.info('Handshake was received from ' + socket.id)

			// Check if this is a reconnect
			const reconnect = Object.values(this.users).includes(socket.id)

			if (reconnect) {
				console.info('This user has reconnected')
				const uid = this.getUidFromSocketId(socket.id)
				const users = Object.values(this.users)

				if (uid) {
					console.log('Sending callback for reconnect')
					callback(uid, users)
					return
				}
			}

			// Generate a new user
			const uid = v4()
			this.users[uid] = socket.id
			const users = Object.values(this.users)

			console.info('Sending callback for handshake')
			callback(uid, users)

			// Send new users to all connects users
			this.sendMessage(
				'user_connected',
				users.filter((id) => id !== socket.id),
				users
			)
		})

		socket.on('disconnect', () => {
			console.info('Disconnect was received from ' + socket.id)

			const uid = this.getUidFromSocketId(socket.id)

			if (uid) {
				delete this.users[uid]
				const users = Object.values(this.users)
				this.sendMessage('user_disconnetced', users, socket.id)
			}
		})
	}

	getUidFromSocketId = (id: string) =>
		Object.keys(this.users).find((uid) => this.users[uid] === id)

	// Send a message throug the socket
	// @param name: the name of the event , ex: handshake
	//  @param users: list of socket id's
	// @param payload: any information needed by the users for state update
	sendMessage = (name: string, users: string[], payload?: Object) => {
		console.info(`Emitting event: ${name} to ${users} containing ${payload}`)
		users.forEach((id) =>
			payload ? this.io.to(id).emit(name, payload) : this.io.to(id).emit(name)
		)
	}
}
