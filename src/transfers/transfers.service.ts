import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as argon2 from 'argon2';
import { AuthService } from 'src/auth/auth.service';
import { Transfer, TransferDocument } from './transfers.schema';
import { CreateTransferDto } from './transfers.dto';
import { StorageService } from 'src/storage/storage.service';

@Injectable()
export class TransferService {
    constructor(@InjectModel(Transfer.name) private transferModel: Model<TransferDocument>,
    private storageService: StorageService) {}

    async create(createTransferDto: CreateTransferDto) {
        const storages = await this.storageService.findAll();
        const products = createTransferDto.products; 
        const transfer: Transfer = {size: 0, data: [], type: createTransferDto.type, date: Date.now(), userName: createTransferDto.userName, place: createTransferDto.place}
        const updatedStorage = [];

        if (createTransferDto.type === '0') {
            products.forEach( (product) => {
                let count = product.count;
                transfer.size += count;
                while(count !== 0) {
                    
                    const storage = createTransferDto.storageID ? storages.find((s) => s.id === createTransferDto.storageID) : storages.find((s) => s.sizeLeft !== 0);
                    let added = storage.sizeLeft;
                    storage.sizeLeft = storage.sizeLeft - count;
                    if (storage.sizeLeft >= 0) {
                        added =  count;
                        count = 0;
                    } else {
                        count = Math.abs(storage.sizeLeft);
                        storage.sizeLeft = 0;
                    }
                     
                    storage.products.push({
                        name: product.name,
                        count: added,
                        title: product.title
                    })
                    transfer.data.push({
                        storage: storage.name,
                        product: {
                            name: product.name,
                            count: added,
                            title: product.title
                        }
                    })
                    updatedStorage.push(storage)
                    // await this.storageService.updateStorage(storage)
                }
            })
        } else if (createTransferDto.type === '1') {
           products.forEach( (p) => {
                let count = p.count;
                transfer.size += count;

                while(count !== 0) {
                    let storage = storages.find((s) => {
                        console.log('storage', s)
                        return !!s.products.find((prod) => prod.name === p.name)
                        });
                   
                    const product = storage.products.find((pr) => pr.name === p.name);
                    let added = product.count;
                    product.count = product.count - count;
                    if (product.count >= 0) {
                        added = count;
                        count = 0;
                    } else {
                        count = Math.abs(product.count);
                        product.count = 0;
                    }

                    storage.products = storage.products.filter((p) => p.count !== 0);

                    transfer.data.push({
                        storage: storage.name,
                        product: {
                            name: p.name,
                            count: added,
                            title: p.title
                        }
                    })
                    if (storage.products.length === 0) {
                        storage.sizeLeft = storage.size;
                    } else {
                        let used = 0;
                        storage.products.forEach((p) => used += p.count);
                        storage.sizeLeft = storage.size - used;
                    }
                    updatedStorage.push(storage);
                    // await this.storageService.updateStorage(storage)
                }
            })
        }
       
        updatedStorage.forEach(async(s) => await this.storageService.updateStorage(s))
        const createdTransfer = new this.transferModel(transfer);
        return createdTransfer.save();
    }

    async findAll() {
        return this.transferModel.find().exec();
    }
}