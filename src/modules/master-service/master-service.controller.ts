import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MasterServiceService } from './master-service.service';
import { CreateMasterServiceDto } from './dto/create-master-service.dto';
import { UpdateMasterServiceDto } from './dto/update-master-service.dto';

@Controller('master-service')
export class MasterServiceController {
  constructor(private readonly masterServiceService: MasterServiceService) {}

  @Post()
  create(@Body() createMasterServiceDto: CreateMasterServiceDto) {
    return this.masterServiceService.create(createMasterServiceDto);
  }

  @Get()
  findAll() {
    return this.masterServiceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.masterServiceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMasterServiceDto: UpdateMasterServiceDto) {
    return this.masterServiceService.update(+id, updateMasterServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.masterServiceService.remove(+id);
  }
}
