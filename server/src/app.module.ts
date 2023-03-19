import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrm } from './config/TypeOrmConfig';
import { WebsocketEvents } from './websocket/websocket.event';
import { WebsocketGateway } from './websocket/websocket.gateway';
import { UsersModule } from './modules/users/users.module';
import { DataSource } from 'typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { AuthService } from './modules/auth/auth.service';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrm), UsersModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, WebsocketGateway, WebsocketEvents, AuthService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
