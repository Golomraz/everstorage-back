import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './room.dto';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { Request } from 'express';

@Controller('rooms')
export class RoomsController {
  constructor(private roomService: RoomService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  create(@Body() createRoomDto: CreateRoomDto, @Req() req: Request) {
    const userId = req.user['id'];
    createRoomDto = {
      host: userId,
      users: createRoomDto.users,
    };
    return this.roomService.create(createRoomDto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomService.remove(id);
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  getRoomById(@Param('id') id: string) {
    return this.roomService.findById(id);
  }

  @UseGuards(AccessTokenGuard)
  @Get('check')
  checkUserInRoom(@Req() req: Request, @Body('room') roomId: string) {
    const userId = req.user['id'];
    return this.roomService.checkIsUserInRoomList(roomId, userId);
  }
}
