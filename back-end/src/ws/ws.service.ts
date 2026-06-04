import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import config from 'asset/config';
import { Server, WebSocket } from 'ws';

@WebSocketGateway(config.SERVER.PORT.WS, { path: '/ws' })
export class WsService implements OnGatewayConnection {
  @WebSocketServer()
  protected server: Server;
  private connectedCount: number = 0;

  public async handleConnection(client: WebSocket) {
    client.send('웹소켓 새로운 연결');
    this.connectedCount = this.server.clients?.size ?? 0;
    console.log('현재 웹소켓 ' + this.connectedCount + '개 연결중..');
  }

  @SubscribeMessage('count')
  public handleEvent(
    @ConnectedSocket() client: WebSocket,
    @MessageBody() body: string,
  ) {
    if (body) console.log(body);
    client.send(this.connectedCount.toString());
  }

  public execAllSend(message: string) {
    this.server.clients.forEach((client) => {
      client.send(message);
    });
  }

  public execOneSend(client: WebSocket, message: string) {
    client.send(message);
  }
}
