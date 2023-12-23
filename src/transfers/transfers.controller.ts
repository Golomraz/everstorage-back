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
import { TransferService } from './transfers.service';
import { CreateTransferDto } from './transfers.dto';

@Controller('transfer')
export class TransferController {
  constructor(private transferService: TransferService) {}

  @Get()
  findAll() {
    return this.transferService.findAll();
  }

  @Post()
  create(@Body() createTransferDto: CreateTransferDto) {
   return this.transferService.create(createTransferDto);
  }
}