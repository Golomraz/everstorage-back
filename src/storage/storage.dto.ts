import { IsNotEmpty } from "class-validator";

export class CreateStorageDto {
    @IsNotEmpty()
    readonly name: string;
  
    @IsNotEmpty()
    readonly size: string;
  }