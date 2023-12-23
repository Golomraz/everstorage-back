import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SocketUser, SocketUserDocument } from './socket-user.schema';
import { CreateSocketUserDto } from './socket-user.dto';

@Injectable()
export class SocketUserService {
  constructor(
    @InjectModel(SocketUser.name)
    private socketUserModel: Model<SocketUserDocument>,
  ) {}

  async create(
    createSocketUserDto: CreateSocketUserDto,
  ): Promise<SocketUserDocument> {
    const createSocketUser = new this.socketUserModel(createSocketUserDto);
    return createSocketUser.save();
  }

  async remove(id: string): Promise<SocketUserDocument> {
    return this.socketUserModel.findOneAndDelete({ clientId: id }).exec();
  }

  async getRoomId(clientId: string): Promise<SocketUserDocument> {
    const socketUser = await this.socketUserModel.find({ clientId: clientId });
    if (!socketUser) throw new BadRequestException('SocketUser does not exist');
    return socketUser[0];
  }
}
