import { Injectable } from '@nestjs/common';
import { CreateToolItemDto } from './dto/create-tool-item.dto';
import { UpdateToolItemDto } from './dto/update-tool-item.dto';

@Injectable()
export class ToolItemService {
  create(createToolItemDto: CreateToolItemDto) {
    return 'This action adds a new toolItem';
  }

  findAll() {
    return `This action returns all toolItem`;
  }

  findOne(id: number) {
    return `This action returns a #${id} toolItem`;
  }

  update(id: number, updateToolItemDto: UpdateToolItemDto) {
    return `This action updates a #${id} toolItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} toolItem`;
  }
}
