import { Injectable } from '@nestjs/common';
import { CreateMasterServiceDto } from './dto/create-master-service.dto';
import { UpdateMasterServiceDto } from './dto/update-master-service.dto';

@Injectable()
export class MasterServiceService {
  create(createMasterServiceDto: CreateMasterServiceDto) {
    return 'This action adds a new masterService';
  }

  findAll() {
    return `This action returns all masterService`;
  }

  findOne(id: number) {
    return `This action returns a #${id} masterService`;
  }

  update(id: number, updateMasterServiceDto: UpdateMasterServiceDto) {
    return `This action updates a #${id} masterService`;
  }

  remove(id: number) {
    return `This action removes a #${id} masterService`;
  }
}
