import { IoAdapter } from '@nestjs/platform-socket.io'
import { DataSource, Repository, getRepository } from 'typeorm'
// import { Session } from '../utils/typeorm'
import * as cookieParser from 'cookie-parser'
import * as cookie from 'cookie'
import { plainToInstance } from 'class-transformer'
import { AuthenticatedSocket } from 'src/utils/interfaces'
import { JwtPayload } from 'src/utils/types/types'
import { UserEntity } from 'src/utils/entities/user.entity'
import { AppModule } from 'src/app.module'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'
import { InjectRepository } from '@nestjs/typeorm'

export class WebsocketAdapter extends IoAdapter {
	private jwtService: JwtService = new JwtService()
	private dataSource: DataSource

	// @InjectRepository(UserEntity)
	// private userRepository: Repository<UserEntity>

	createIOServer(port: number, options?: any) {
		// console.log('This is this.dataSource', this.dataSource)
		// const userRepository = this.dataSource.getRepository(UserEntity)
		// const userRepository = getRepository(UserEntity, 'Users')

		const server = super.createIOServer(port, options)
		console.log('mate')

		server.use(async (socket: AuthenticatedSocket, next) => {
			// console.log('This is this.userRepository', this.userRepository)

			console.log('Inside Websocket Adapter')
			const accesToken = socket.handshake.headers.authorization.replace('Bearer', '').trim()
			const decodedToken: JwtPayload = await this.jwtService.verifyAsync(accesToken, {
				secret: process.env.ACCESS_TOKEN_SECRET,
			})

			// const user = await userRepository.findOneBy({ id: decodedToken.sub })
			// console.log('This is user', user)

			console.log('This is accesToken', accesToken)
			console.log('This is decodedToken', decodedToken)
			socket.user = { id: 'mate' } as UserEntity
			next()
		})
		console.log('fuck man')
		return server
	}
}

// export class WebsocketAdapter extends IoAdapter {
// 	// constructor() {
// 	// 	super()
// 	// }
// 	private jwtService: JwtService = new JwtService()

// 	createIOServer(port: number, options?: any) {
// 		// this.jwtService

// 		// const sessionRepository = getRepository(Session)
// 		// const userRepository = new DataSource({})
// 		// const userRepository = await AppModule.getRepository(UserEntity)

// 		// private jwtService: JwtService,
// 		// const userRepository = getRepository(UserEntity)

// 		console.log('working?')

// 		const server = super.createIOServer(port, options)
// 		console.log('This is server', server)
// 		server.use(async (socket: AuthenticatedSocket, next) => {
// 			console.log('Inside Websocket Adapter')
// 			const accesToken = socket.handshake.headers.authorization.replace('Bearer', '').trim()
// 			console.log('This is accesToken', accesToken)
// 			// // const decodedToken: JwtPayload = await this.jwtService.verifyAsync(accesToken, {
// 			// // 	secret: process.env.ACCESS_TOKEN_SECRET,
// 			// // })

// 			// console.log('This is decodedToken', decodedToken)

// 			// // const user: UserEntity = await this.userService.findById(decodedToken.sub)
// 			// const user: UserEntity = await userRepository.findOneBy({
// 			// 	id: decodedToken.sub,
// 			// })
// 			// console.log('This is user', user)

// 			// user.socketId = socket.id
// 			// await user.save()

// 			// if (!user) {
// 			// 	// await this.userService.removeUserSocketId(user.id)
// 			// 	return next(new Error('Not Authenticated'))
// 			// }
// 			// // await this.userService.updateUserSocketId(user.id, socket.id)
// 			// socket.user = user
// 			socket.user = { id: 'fuck' } as UserEntity

// 			next()
// 		})
// 		return server
// 	}
// }
