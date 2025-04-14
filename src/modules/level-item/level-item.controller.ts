import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LevelItemService } from './level-item.service';
import { CreateLevelItemDto } from './dto/create-level-item.dto';
import { UpdateLevelItemDto } from './dto/update-level-item.dto';

@Controller('level-item')
export class LevelItemController {
  constructor(private readonly levelItemService: LevelItemService) {}

  @Post()
  create(@Body() createLevelItemDto: CreateLevelItemDto) {
    return this.levelItemService.create(createLevelItemDto);
  }

  @Get()
  findAll() {
    return this.levelItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.levelItemService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLevelItemDto: UpdateLevelItemDto) {
    return this.levelItemService.update(+id, updateLevelItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.levelItemService.remove(+id);
  }
}
