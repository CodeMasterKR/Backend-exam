import { Injectable } from '@nestjs/common';
import { CreateAtributeDto } from './dto/create-atribute.dto';
import { UpdateAtributeDto } from './dto/update-atribute.dto';

@Injectable()
export class AtributeService {
  create(createAtributeDto: CreateAtributeDto) {
    return 'This action adds a new atribute';
  }

  findAll() {
    return `This action returns all atribute`;
  }

  findOne(id: number) {
    return `This action returns a #${id} atribute`;
  }

  update(id: number, updateAtributeDto: UpdateAtributeDto) {
    return `This action updates a #${id} atribute`;
  }

  remove(id: number) {
    return `This action removes a #${id} atribute`;
  }
}
