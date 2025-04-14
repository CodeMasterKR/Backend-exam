import { PartialType } from '@nestjs/mapped-types';
import { CreateProductAtributeDto } from './create-product-atribute.dto';

export class UpdateProductAtributeDto extends PartialType(CreateProductAtributeDto) {}
