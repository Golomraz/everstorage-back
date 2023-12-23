import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SocketUserDocument = SocketUser & Document;

@Schema()
export class SocketUser {
  @Prop()
  clientId: string;

  @Prop()
  roomId: string;
}

export const SocketUserSchema = SchemaFactory.createForClass(SocketUser);
