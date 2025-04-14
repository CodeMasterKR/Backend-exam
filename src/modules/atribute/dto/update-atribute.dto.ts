import { PartialType } from '@nestjs/mapped-types';
import { CreateAtributeDto } from './create-atribute.dto';

export class UpdateAtributeDto extends PartialType(CreateAtributeDto) {}
