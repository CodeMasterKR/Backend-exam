import { PartialType } from '@nestjs/mapped-types';
import { CreateLevelItemDto } from './create-level-item.dto';

export class UpdateLevelItemDto extends PartialType(CreateLevelItemDto) {}
