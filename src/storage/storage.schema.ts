import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Product } from 'src/transfers/transfers.dto';

export type StorageDocument = Storage & Document;

@Schema()
export class Storage {
  @Prop({ required: true })
  size: number;

  @Prop({ required: true })
  sizeLeft: number;

  @Prop()
  products: Product[];

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  coordinates: number[];

}

export const StorageSchema = SchemaFactory.createForClass(Storage);
