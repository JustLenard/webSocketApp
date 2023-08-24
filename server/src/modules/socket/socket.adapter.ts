import { Logger } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { IoAdapter } from '@nestjs/platform-socket.io'
import { dataSource } from 'src/config/dataSourceOptions'
import { UserEntity } from 'src/utils/entities/user.entity'
import { AuthenticatedSocket } from 'src/utils/interfaces'
import { JwtPayload } from 'src/utils/types/types'

export class WebsocketAdapter extends IoAdapter {
	private jwtService: JwtService = new JwtService()
	private readonly logger = new Logger('WebSocketAdapter')

	createIOServer(port: number, options?: any) {
		this.logger.log('Inside the WebSocket Adapter')
		const userRepository = dataSource.getRepository(UserEntity)

		const server = super.createIOServer(port, options)

		server.use(async (socket: AuthenticatedSocket, next) => {
			this.logger.log('Aplying midlleware to socket')

			const accesToken = socket.handshake.headers.authorization.replace('Bearer', '').trim()
			this.logger.log(`Decoding token ${accesToken}`)
			try {
				const decodedToken: JwtPayload = await this.jwtService.verifyAsync(accesToken, {
					secret: process.env.ACCESS_TOKEN_SECRET,
				})
				this.logger.log(`Token decoded belongs to user ${decodedToken.username}, id: ${decodedToken.sub}`)

				const user = await userRepository.findOneBy({ id: decodedToken.sub })

				socket.user = user
				next()
			} catch (err) {
				console.log('This is err', err)

				this.logger.log('Received invalid token')
				socket.disconnect()
			}
		})
		return server
	}
}
