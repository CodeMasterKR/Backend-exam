import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AtributeService } from './atribute.service';
import { CreateAtributeDto } from './dto/create-atribute.dto';
import { UpdateAtributeDto } from './dto/update-atribute.dto';

@Controller('atribute')
export class AtributeController {
  constructor(private readonly atributeService: AtributeService) {}

  @Post()
  create(@Body() createAtributeDto: CreateAtributeDto) {
    return this.atributeService.create(createAtributeDto);
  }

  @Get()
  findAll() {
    return this.atributeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.atributeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAtributeDto: UpdateAtributeDto) {
    return this.atributeService.update(+id, updateAtributeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.atributeService.remove(+id);
  }
}
