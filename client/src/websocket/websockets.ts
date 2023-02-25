import io, { Socket } from 'socket.io-client'

const socket: Socket = io('http://localhost:5000')

socket.on('connect', () => {
	console.log('Connected to WebSocket server')
})

socket.on('disconnect', () => {
	console.log('Disconnected from WebSocket server')
})
