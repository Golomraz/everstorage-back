import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    Param,
    Patch,
    Post,
    Req,
    UseGuards,
  } from '@nestjs/common';
  import { AccessTokenGuard } from 'src/guards/accessToken.guard';
  import { Request } from 'express';
import { StorageService } from './storage.service';
import { CreateStorageDto } from './storage.dto';

@Controller('storage')
export class StorageController {
  constructor(private storageService: StorageService) {}

  @Get()
  findAll() {
    return this.storageService.findAll();
  }

  @Get('status')
  allStatus() {
    return this.storageService.getAllStatus();
  }

  @Get('find/:id')
  findById(@Param('id') id: string) {
    return this.storageService.findById(id);
  }

  @Get(':letter')
  findByLetter(@Param('letter') letter: string) {
    return this.storageService.findByLetters(letter);
  }

  @Post()
  create(@Body() createStorageDto: CreateStorageDto) {
    return this.storageService.create(createStorageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storageService.remove(id);
  }
}