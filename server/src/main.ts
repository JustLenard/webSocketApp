import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.enableCors({
  //   origin: ['http://localhost:3000/users', 'http://localhost:3000', 'yomama'],
  //   allowedHeaders:
  //     'Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin',
  //   credentials: true,
  // });
  app.enableCors();

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
