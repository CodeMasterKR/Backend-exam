import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductAtributeService } from './product-atribute.service';
import { CreateProductAtributeDto } from './dto/create-product-atribute.dto';
import { UpdateProductAtributeDto } from './dto/update-product-atribute.dto';

@Controller('product-atribute')
export class ProductAtributeController {
  constructor(private readonly productAtributeService: ProductAtributeService) {}

  @Post()
  create(@Body() createProductAtributeDto: CreateProductAtributeDto) {
    return this.productAtributeService.create(createProductAtributeDto);
  }

  @Get()
  findAll() {
    return this.productAtributeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productAtributeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductAtributeDto: UpdateProductAtributeDto) {
    return this.productAtributeService.update(+id, updateProductAtributeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productAtributeService.remove(+id);
  }
}
