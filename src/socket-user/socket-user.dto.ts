import { IsNotEmpty } from 'class-validator';

export class CreateSocketUserDto {
  @IsNotEmpty()
  readonly clientId: string;

  @IsNotEmpty()
  readonly roomId: string;
}
