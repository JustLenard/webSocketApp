import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'
import { dataSource } from './config/TypeOrmConfig'
import { WebsocketAdapter } from './modules/socket/socket.adapter'

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule)
	await dataSource.initialize()

	app.set('trust proxy', 'loopback')
	app.setGlobalPrefix('api')

	const adapter = new WebsocketAdapter(app)
	app.useWebSocketAdapter(adapter)

	app.enableCors({
		origin: ['http://localhost:5173'],
		allowedHeaders: [
			'Origin',
			'X-Requested-With',
			'Content-Type',
			'Accept',
			'Access-Control-Allow-Origin',
			'authorization',
		],
		credentials: true,
	})
	app.use(cookieParser())

	// Set the logging level to "verbose"
	const logger = new Logger()
	app.useLogger(logger)

	// Enable global validation
	app.useGlobalPipes(new ValidationPipe())

	await app.listen(5000)
	// Start the application
	logger.verbose('Application started.')
}
bootstrap()
