import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './user.dto';
import * as argon2 from 'argon2';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<any> {
    const user = await this.userModel.findById(id);
    if (user) {
      return {
        id: user._id,
        username: user.username,
        role: user.role
      };
    }
  }

  async findFullById(id: string): Promise<any> {
    const user = await this.userModel.findById(id);
    if (user) {
      return user;
    }
  }

  async findByUsernameLetters(letter: string): Promise<UserDocument[]> {
    return this.userModel
      .find({ username: { $regex: letter, $options: 'i' } })
      .exec();
  }

  async findByUsername(username: string): Promise<UserDocument> {
    return this.userModel.findOne({ username }).exec();
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {

    if ('password' in updateUserDto) {
      updateUserDto.password = await this.hashData(updateUserDto.password);
    }

    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<UserDocument> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  hashData(data: string) {
    return argon2.hash(data);
  }
}
