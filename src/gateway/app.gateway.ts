import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { RoomService } from 'src/room/room.service';
import { SocketUserService } from 'src/socket-user/socket-user.service';

@WebSocketGateway({ cors: true })
export class AppGateway implements OnGatewayDisconnect {
  constructor(
    private roomService: RoomService,
    private socketUserService: SocketUserService,
  ) {}
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): void {
    client.broadcast.emit(payload.type, payload.data);
  }

  @SubscribeMessage('join')
  async handleRoomConnection(client: Socket, payload: any): Promise<void> {
    client.join(payload.data);
    await this.socketUserService.create({
      clientId: client.id,
      roomId: payload.data,
    });
    await this.roomService.updateUserStatus(
      payload.data,
      {
        ...payload.user,
        sockeId: client.id,
      },
      true,
    );
    this.server.to(payload.data).emit(payload.data, {
      ...payload.user,
      sockeId: client.id,
    });
  }

  @SubscribeMessage('leave')
  async handleRoomLeave(client: Socket, payload: any): Promise<void> {
    client.leave(payload.data);
    await this.roomService.updateUserStatus(payload.data, payload.user, false);
    await this.socketUserService.remove(client.id);
    client.to(payload.data).emit('leaved', payload.user);
  }

  @SubscribeMessage('micro-change')
  async handleMicroChange(client: Socket, payload: any): Promise<void> {
    await this.roomService.changeUserMciroStatusInRoom(
      payload.data,
      client.id,
      !payload.status,
    );
    this.server.to(payload.data).emit('micro-changed', payload);
  }

  @SubscribeMessage('delete')
  async handleRoomDelete(client: Socket, payload: any): Promise<void> {
    this.server.to(payload.data).emit('deleted', payload.data);
    await this.roomService.remove(payload.data);
  }

  @SubscribeMessage('audio-stream')
  handleAudio(client: Socket, payload: any): void {
    client
      .to(payload.room)
      .emit('audio-stream', { audio: payload.data, user: payload.user });
  }

  @SubscribeMessage('ask-to-join')
  handleJoinRequest(client: Socket, payload: any): void {
    client.to(payload.data._id).emit(payload.data.host, payload.user);
  }

  @SubscribeMessage('accept')
  handleAccept(client: Socket, payload: any): void {
    client.broadcast.emit(payload.user.id, true);
  }

  @SubscribeMessage('decline')
  handleDecline(client: Socket, payload: any): void {
    client.broadcast.emit(payload.user.id, false);
  }

  @SubscribeMessage('kick')
  async handleKick(client: Socket, payload: any) {
    await this.socketUserService.remove(client.id);
    await this.roomService.removeUserFromRoom(payload.data, payload.user.id);
    client.to(payload.data).emit('kicked', payload.user);
  }

  async handleDisconnect(client: Socket) {
    const socketUser = await this.socketUserService.getRoomId(client.id);
    await this.socketUserService.remove(client.id);
    if (!socketUser) return;
    await this.roomService.changeUserStatusInRoom(
      socketUser.roomId,
      client.id,
      false,
    );
    client.to(socketUser.roomId).emit('disconnected');
  }
}
