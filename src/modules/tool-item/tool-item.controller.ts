import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ToolItemService } from './tool-item.service';
import { CreateToolItemDto } from './dto/create-tool-item.dto';
import { UpdateToolItemDto } from './dto/update-tool-item.dto';

@Controller('tool-item')
export class ToolItemController {
  constructor(private readonly toolItemService: ToolItemService) {}

  @Post()
  create(@Body() createToolItemDto: CreateToolItemDto) {
    return this.toolItemService.create(createToolItemDto);
  }

  @Get()
  findAll() {
    return this.toolItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.toolItemService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateToolItemDto: UpdateToolItemDto) {
    return this.toolItemService.update(+id, updateToolItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.toolItemService.remove(+id);
  }
}
