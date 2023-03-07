import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrm } from './config/TypeOrmConfig';
import { WebsocketEvents } from './websocket/websocket.event';
import { WebsocketGateway } from './websocket/websocket.gateway';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrm), UsersModule],
  controllers: [AppController],
  providers: [AppService, WebsocketGateway, WebsocketEvents],
})
export class AppModule {}
