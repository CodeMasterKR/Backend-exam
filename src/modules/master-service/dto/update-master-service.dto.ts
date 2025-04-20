import { PartialType } from '@nestjs/swagger';
import { CreateMasterServiceDto } from './create-master-service.dto';

export class UpdateMasterServiceDto extends PartialType(CreateMasterServiceDto) {}