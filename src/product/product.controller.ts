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
import { ProductService } from './product.service';
import { CreateProductDto } from './product.dto';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }

  @Patch()
  update(@Body() createProductDto: CreateProductDto) {
    return this.productService.update(createProductDto);
  }
}