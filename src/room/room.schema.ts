import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoomDocument = Room & Document;

@Schema()
export class Room {
  @Prop()
  host: string;

  @Prop()
  users: string;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
