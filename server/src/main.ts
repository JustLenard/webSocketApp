import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  console.log(process.env.SECRET);

  app.enableCors({
    origin: ['http://localhost:5173'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Access-Control-Allow-Origin',
    ],
    credentials: true,
  });
  // app.enableCors();
  app.use(cookieParser());

  // Set the logging level to "verbose"
  const logger = new Logger();
  app.useLogger(logger);

  // Enable global validation
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(5000);
  // Start the application
  logger.verbose('Application started.');
}
bootstrap();
