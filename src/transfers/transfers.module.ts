import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Transfer, TransferSchema } from './transfers.schema';
import { TransferController } from './transfers.controller';
import { TransferService } from './transfers.service';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Transfer.name, schema: TransferSchema }]),
    StorageModule
  ], 
  controllers: [TransferController],
  exports: [TransferService],
  providers: [TransferService],
})
export class TransferModule {}
