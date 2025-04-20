import { PartialType } from '@nestjs/swagger';
import { CreateMasterDto } from './create-master.dto';

// PartialType yordamida CreateMasterDto dagi barcha maydonlar ixtiyoriy qilinadi
export class UpdateMasterDto extends PartialType(CreateMasterDto) {}