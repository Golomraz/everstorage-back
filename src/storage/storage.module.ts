import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';
import { Storage, StorageSchema } from './storage.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Storage.name, schema: StorageSchema }]),
  ], 
  controllers: [StorageController],
  exports: [StorageService],
  providers: [StorageService],
})
export class StorageModule {}
