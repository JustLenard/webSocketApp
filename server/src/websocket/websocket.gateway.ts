import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class WebsocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private connectedClients = 0;

  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  handleConnection() {
    this.connectedClients++;
    console.log(
      `Client connected (total connected clients: ${this.connectedClients})`,
    );
  }

  handleDisconnect() {
    this.connectedClients--;
    console.log(
      `Client disconnected (total connected clients: ${this.connectedClients})`,
    );
  }
}
