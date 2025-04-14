import { PartialType } from '@nestjs/mapped-types';
import { CreateToolItemDto } from './create-tool-item.dto';

export class UpdateToolItemDto extends PartialType(CreateToolItemDto) {}
