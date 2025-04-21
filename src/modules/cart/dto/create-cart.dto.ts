import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, ValidateNested, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateToolItemDto } from './create-tool-item.dto';
import { CreateMasterCategoryItemDto } from './create-master-category-item.dto';

export class CreateCartDto {
  @ApiProperty({ example: 'uuid', description: 'User ID (UUID)' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    type: [CreateToolItemDto],
    description: 'List of tool items in the cart',
    required: false,
    example: [
      { toolAttributeId: 'uuid', count: 3 },
      { toolAttributeId: 'uuid', count: 1 }
    ]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateToolItemDto)
  @IsOptional()
  toolItems?: CreateToolItemDto[];

  @ApiProperty({
    type: [CreateMasterCategoryItemDto],
    description: 'List of master category items in the cart',
    required: false,
    example: [
      { levelId: 'uuid', count: 2 },
      { levelId: 'uuid', count: 4 }
    ]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMasterCategoryItemDto)
  @IsOptional()
  masterCategoryItems?: CreateMasterCategoryItemDto[];

  @ApiProperty({ example: false, description: 'Is the cart completed?', required: false, default: false })
  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean = false;
}