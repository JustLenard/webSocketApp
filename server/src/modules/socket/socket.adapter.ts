import { IoAdapter } from '@nestjs/platform-socket.io'
import { DataSource, EntityManager, Repository, getRepository } from 'typeorm'
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
import { InjectDataSource, InjectRepository, getEntityManagerToken } from '@nestjs/typeorm'
import { INestApplicationContext } from '@nestjs/common'

export class WebsocketAdapter extends IoAdapter {
	private jwtService: JwtService = new JwtService()
	// constructor(private readonly entityManager: EntityManager) {
	// 	super()
	// }
	constructor(private app: INestApplicationContext, private dataSource: DataSource) {
		super()
	}

	// @InjectRepository(UserEntity)
	// private userRepository: Repository<UserEntity>

	// @InjectDataSource()
	// dataSource: DataSource
	// userRepository = getRepository(UserEntity)

	createIOServer(port: number, options?: any) {
		// console.log('This is this.dataSource', this.dataSource)
		const userRepository = this.dataSource.manager

		// console.log('This is userRepository', userRepository)
		// const len = userRepository.find(UserEntity)

		// const len = userRepository.findOneBy({ username: 'len' })

		// console.log('This is len', len)
		// const userRepository = getEntityManager(UserEntity, 'Users')
		// getEntityManagerToken()

		// console.log('This is userRepository', this.userRepository)

		const server = super.createIOServer(port, options)
		console.log('mate')

		server.use(async (socket: AuthenticatedSocket, next) => {
			// const len = userRepository.findOneBy({ username: 'len' })
			// console.log('This is len', len)

			// console.log('This is this.userRepository', this.userRepository)

			console.log('Inside Websocket Adapter')

			// console.log('This is userRepository', this.userRepository)

			const accesToken = socket.handshake.headers.authorization.replace('Bearer', '').trim()
			const decodedToken: JwtPayload = await this.jwtService.verifyAsync(accesToken, {
				secret: process.env.ACCESS_TOKEN_SECRET,
			})

			// const user = await userRepository.findOneBy({ id: decodedToken.sub })
			// console.log('This is user', user)

			console.log('This is accesToken', accesToken)
			console.log('This is decodedToken', decodedToken)
			socket.user = { id: '2faa6629-590e-4f6e-aed5-a164606040df' } as UserEntity
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
