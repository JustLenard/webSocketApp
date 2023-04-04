import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrm } from './config/TypeOrmConfig';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { WebsocketEvents } from './websocket/websocket.event';
import { WebsocketGateway } from './websocket/websocket.gateway';
import { OpenAiModule } from './modules/open-ai/open-ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeOrm),
    UsersModule,
    AuthModule,
    OpenAiModule,
  ],
  controllers: [AppController],
  providers: [AppService, WebsocketGateway, WebsocketEvents],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
