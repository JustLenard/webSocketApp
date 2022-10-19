// const WebSocket = require('ws')
// const server = new WebSocket.Sever({ port: 8000 })

// server.on('connection', (socket) => {
// 	socket.on('meassage', (message) => {
// 		socket.send(`Roget that. Message is ${message}`)
// 	})
// })

const express = require('express')
const http = require('http')
const cors = require('cors')

const { Server } = require('socket.io')
const PORT = 3001

const app = express()
app.use(cors)
const server = http.createServer(app)

const io = new Server(server, {
	cors: {
		origin: 'http://localhost:3000',
		methods: ['GET', 'POST'],
	},
})

server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`)
})
