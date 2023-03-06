import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrm } from './config/TypeOrmConfig';
import { WebsocketEvents } from './websocket/websocket.event';
import { WebsocketGateway } from './websocket/websocket.gateway';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrm)],
  controllers: [AppController],
  providers: [AppService, WebsocketGateway, WebsocketEvents],
})
export class AppModule {}
