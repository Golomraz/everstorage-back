import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Product } from './transfers.dto';

export type TransferDocument = Transfer & Document;

@Schema()
export class Transfer {
  @Prop()
  size: number;

  @Prop()
  data: TransferData[];

  @Prop()
  type: string;

  @Prop()
  date: number;

  @Prop()
  userName: string;
}

export interface TransferData {
  storage: string;
  product: Product;
}

export const TransferSchema = SchemaFactory.createForClass(Transfer);
