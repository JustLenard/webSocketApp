import io, { Socket } from 'socket.io-client'

export const socket: Socket = io('http://localhost:5000')

socket.on('connect', () => {
	console.log('Connected to WebSocket server')
})

socket.on('message', (data) => {
	console.log('This is data', data)
	console.log('message')
})

socket.on('disconnect', () => {
	console.log('Disconnected from WebSocket server')
})
