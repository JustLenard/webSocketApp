import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WebsocketEvents {
  handleConnection(client: Socket, server: Server) {
    console.log(`Client ${client.id} connected`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client ${client.id} disconnected`);
  }

  handleMessage(client: Socket, payload: any, server: Server) {
    console.log(`Received message from client ${client.id}: ${payload}`);
    // server.emit('message', payload);
  }
}
