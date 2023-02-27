import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { WebsocketEvents } from './websocket.event';
import { identity } from 'rxjs';

@WebSocketGateway({ cors: true })
@Injectable()
export class WebsocketGateway {
  constructor(private readonly events: WebsocketEvents) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  @SubscribeMessage('events')
  handleEvent(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): string {
    console.log('This is data', data);
    return data;
  }

  @SubscribeMessage('clickStream')
  handleClickStream(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): any {
    const arrClientsIds = [];

    console.log('This is data', data);

    this.server.sockets.sockets.forEach((sokc) => arrClientsIds.push(sokc.id));

    console.log('This is arrClientsIds', arrClientsIds);

    this.server.emit('message', 'from backend');

    return data;
  }

  @SubscribeMessage('sendMessage')
  receiveMessage(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): any {
    console.log('This is data', data);
    this.server.emit('message', 'from backend');

    return data;
  }
  handleConnection(client: Socket) {
    this.events.handleConnection(client, this.server);
  }

  handleDisconnect(client: Socket) {
    this.events.handleDisconnect(client);
  }

  handleMessage(client: Socket, payload: any) {
    this.events.handleMessage(client, payload, this.server);
  }
}
