import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AppGateway } from './gateway/app.gateway';
import { RoomModule } from './room/room.module';
import { SocketUserModule } from './socket-user/socket-user.module';
import { StorageModule } from './storage/storage.module';
import { TransferModule } from './transfers/transfers.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://vitalik:1234567890@cluster0.jkpqviu.mongodb.net/?retryWrites=true&w=majority'),
    UserModule,
    AuthModule,
    RoomModule,
    SocketUserModule,
    StorageModule,
    ProductModule,
    TransferModule
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
