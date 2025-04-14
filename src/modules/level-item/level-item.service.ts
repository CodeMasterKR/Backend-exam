import { Injectable } from '@nestjs/common';
import { CreateLevelItemDto } from './dto/create-level-item.dto';
import { UpdateLevelItemDto } from './dto/update-level-item.dto';

@Injectable()
export class LevelItemService {
  create(createLevelItemDto: CreateLevelItemDto) {
    return 'This action adds a new levelItem';
  }

  findAll() {
    return `This action returns all levelItem`;
  }

  findOne(id: number) {
    return `This action returns a #${id} levelItem`;
  }

  update(id: number, updateLevelItemDto: UpdateLevelItemDto) {
    return `This action updates a #${id} levelItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} levelItem`;
  }
}
