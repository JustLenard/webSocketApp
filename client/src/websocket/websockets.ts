import io, { Socket } from 'socket.io-client'

export const socket: Socket = io(import.meta.env.VITE_APP_API)

socket.on('connect', () => {
	// console.log('Connected to WebSocket server')
})

socket.on('message', (data) => {
	// console.log('This is data', data)
	// console.log('message')
})

socket.on('disconnect', () => {
	// console.log('Disconnected from WebSocket server')
})
