import { PartialType } from '@nestjs/swagger';
import { CreateToolAttributeDto } from './create-tool-attribute.dto';

export class UpdateToolAttributeDto extends PartialType(CreateToolAttributeDto) {}