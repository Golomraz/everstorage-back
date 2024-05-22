import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as argon2 from 'argon2';
import { AuthService } from 'src/auth/auth.service';
import { ProductDocument, Product } from './product.schema';
import { CreateProductDto } from './product.dto';

@Injectable()
export class ProductService {
    constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}

    async create(createProductDto: CreateProductDto): Promise<ProductDocument> {

        const isStorageExist = await this.findByLetters(createProductDto.name);

        if (isStorageExist.length === 0) {
            const createdStorage = new this.productModel(createProductDto);
            return createdStorage.save();
        }
       
        throw new HttpException('Already exist', HttpStatus.BAD_REQUEST);
    }

    async findByLetters(letter: string) {
        return this.productModel.find({ name: { $regex: letter, $options: 'i' } }).exec();
    }

    async findAll(): Promise<ProductDocument[]> {
        return this.productModel.find().exec();
    }

    async remove(id: string) {
        return this.productModel.findByIdAndDelete(id).exec();
    }

    async update(
        createProductDto: CreateProductDto,
      ): Promise<ProductDocument> {
        const productId = await this.findByLetters(createProductDto.name)

        return this.productModel
          .findByIdAndUpdate(productId[0].id, createProductDto, { new: true })
          .exec();
      }
}