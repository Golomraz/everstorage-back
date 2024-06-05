import { IsNotEmpty } from "class-validator";

export class CreateStorageDto {
    @IsNotEmpty()
    readonly name: string;
  
    @IsNotEmpty()
    readonly size: string;

    @IsNotEmpty()
    readonly coordinates: number[];

    readonly adress: string;
  }