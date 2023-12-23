import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SocketUser, SocketUserSchema } from './socket-user.schema';
import { SocketUserController } from './socket-user.controller';
import { SocketUserService } from './socket-user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SocketUser.name, schema: SocketUserSchema },
    ]),
  ],
  controllers: [SocketUserController],
  exports: [SocketUserService],
  providers: [SocketUserService],
})
export class SocketUserModule {}
