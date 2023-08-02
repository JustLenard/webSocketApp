import { IoAdapter } from '@nestjs/platform-socket.io'
import { Logger } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { dataSource } from 'src/config/TypeOrmConfig'
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
			const decodedToken: JwtPayload = await this.jwtService.verifyAsync(accesToken, {
				secret: process.env.ACCESS_TOKEN_SECRET,
			})

			const user = await userRepository.findOneBy({ id: decodedToken.sub })

			socket.user = user
			next()
		})
		return server
	}
}
