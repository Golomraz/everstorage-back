import { IsNotEmpty } from "class-validator";

export class CreateTransferDto {
    @IsNotEmpty()
    readonly products: Product[];
  
    @IsNotEmpty()
    readonly type: string;

    @IsNotEmpty()
    readonly userName: string;

    @IsNotEmpty()
    readonly place: string;

    readonly storageID: string;
  }

export interface Product {
    name: string;
    count: number;
    title: string;
}