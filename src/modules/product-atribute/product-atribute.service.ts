import { Injectable } from '@nestjs/common';
import { CreateProductAtributeDto } from './dto/create-product-atribute.dto';
import { UpdateProductAtributeDto } from './dto/update-product-atribute.dto';

@Injectable()
export class ProductAtributeService {
  create(createProductAtributeDto: CreateProductAtributeDto) {
    return 'This action adds a new productAtribute';
  }

  findAll() {
    return `This action returns all productAtribute`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productAtribute`;
  }

  update(id: number, updateProductAtributeDto: UpdateProductAtributeDto) {
    return `This action updates a #${id} productAtribute`;
  }

  remove(id: number) {
    return `This action removes a #${id} productAtribute`;
  }
}
