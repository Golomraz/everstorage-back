import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Room, RoomDocument } from './room.schema';
import { Model } from 'mongoose';
import { CreateRoomDto } from './room.dto';

@Injectable()
export class RoomService {
  constructor(@InjectModel(Room.name) private roomModel: Model<RoomDocument>) {}

  async create(createRoomDto: CreateRoomDto): Promise<RoomDocument> {
    const createdRoom = new this.roomModel(createRoomDto);
    return createdRoom.save();
  }

  async remove(id: string): Promise<RoomDocument> {
    return this.roomModel.findByIdAndDelete(id).exec();
  }

  async checkIsUserInRoomList(roomId: string, userId) {
    const room = await this.roomModel.findById(roomId);

    if (!room) throw new BadRequestException('User does not exist');

    const isExist = room.users.split(',').find((el) => el === userId);

    return !!isExist;
  }

  async findById(id: string) {
    return this.roomModel.findById(id).exec();
  }

  async updateUserStatus(id: string, user: any, status: boolean) {
    const room = await this.roomModel.findById(id);
    if (!room) return;
    const users = JSON.parse(room.users).map((u) => {
      if (u.id === user.id) {
        u.status = status;
        u.sockeId = user.sockeId;
      }
      return u;
    });

    if (status) {
      const currentUser = users.find((u) => u.id === user.id);
      if (!currentUser) users.push({ ...user, status });
    }

    room.users = JSON.stringify(users);

    this.roomModel.findByIdAndUpdate(id, room).exec();
  }

  async changeUserStatusInRoom(
    id: string,
    userSocket: string,
    status: boolean,
  ) {
    const room = await this.roomModel.findById(id);
    if (!room) throw new BadRequestException('Room does not exist');
    const users = JSON.parse(room.users).map((u) => {
      if (u.sockeId === userSocket) {
        u.status = status;
      }
      return u;
    });
    room.users = JSON.stringify(users);
    this.roomModel.findByIdAndUpdate(id, room).exec();
  }

  async changeUserMciroStatusInRoom(
    id: string,
    userSocket: string,
    status: boolean,
  ) {
    const room = await this.roomModel.findById(id);
    if (!room) throw new BadRequestException('Room does not exist');
    const users = JSON.parse(room.users).map((u) => {
      if (u.sockeId === userSocket) {
        u.microOff = status;
      }
      return u;
    });
    room.users = JSON.stringify(users);
    this.roomModel.findByIdAndUpdate(id, room).exec();
  }

  async removeUserFromRoom(id: string, userId: string) {
    const room = await this.roomModel.findById(id);
    if (!room) throw new BadRequestException('Room does not exist');
    const users = JSON.parse(room.users).filter((u) => u.id !== userId);

    room.users = JSON.stringify(users);
    this.roomModel.findByIdAndUpdate(id, room).exec();
  }
}
