import { Injectable } from '@nestjs/common';
import { CreateToolCategoryDto } from './dto/create-tool-category.dto';
import { UpdateToolCategoryDto } from './dto/update-tool-category.dto';

@Injectable()
export class ToolCategoryService {
  create(createToolCategoryDto: CreateToolCategoryDto) {
    return 'This action adds a new toolCategory';
  }

  findAll() {
    return `This action returns all toolCategory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} toolCategory`;
  }

  update(id: number, updateToolCategoryDto: UpdateToolCategoryDto) {
    return `This action updates a #${id} toolCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} toolCategory`;
  }
}
