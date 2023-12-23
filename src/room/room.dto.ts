import { IsNotEmpty } from 'class-validator';

export class CreateRoomDto {
  @IsNotEmpty()
  readonly host: string;

  @IsNotEmpty()
  readonly users: string;
}
