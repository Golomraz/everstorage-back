import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as argon2 from 'argon2';
import { AuthService } from 'src/auth/auth.service';
import { StorageDocument, Storage } from './storage.schema';
import { CreateStorageDto } from './storage.dto';

@Injectable()
export class StorageService {
    constructor(@InjectModel(Storage.name) private storageModel: Model<StorageDocument>) {}

    async create(createStorageDto: CreateStorageDto): Promise<StorageDocument> {
        const data = {...createStorageDto, sizeLeft: createStorageDto.size};

        const isStorageExist = await this.findByLetters(createStorageDto.name);

        if (isStorageExist.length === 0) {
            const createdStorage = new this.storageModel(data);
            return createdStorage.save();
        }
       
        throw new HttpException('Already exist', HttpStatus.BAD_REQUEST);
    }

    async findAll(): Promise<StorageDocument[]> {
        return this.storageModel.find().exec();
    }

    async findById(id: string) {
        return this.storageModel.findById(id).exec();
    }

    async updateStorage(updateStorageDto) {
        await this.storageModel.findByIdAndUpdate(updateStorageDto._id, updateStorageDto).exec();
    }

    async remove(id: string) {
        return this.storageModel.findByIdAndDelete(id).exec();
    }

    async findByLetters(letter: string) {
        return this.storageModel.find({ name: { $regex: letter, $options: 'i' } }).exec();
    }

    async getAllStatus() {
        const storages = await this.findAll();
        const status = {
            sizeLeft: 0,
            products: []
        }

        storages.forEach((s) => {
            status.sizeLeft += s.sizeLeft;
            s.products.forEach((p) => {
                const isExist = status.products.find((pr) => p.name === pr.name);
                if (isExist) {
                    isExist.count += p.count
                } else {
                    status.products.push(p)
                }
            })
        })
        return status;
    }
}