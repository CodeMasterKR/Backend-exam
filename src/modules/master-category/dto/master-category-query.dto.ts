import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Min,
  IsIn,
} from 'class-validator';

export class MasterCategoryQueryDto {
  @ApiPropertyOptional({ description: 'Sahifa raqami', default: 1, type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Har sahifadagi elementlar soni',
    default: 10,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Qidiruv matni (nomlar bo\'yicha)',
    example: 'texnika',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Saralash maydoni',
    example: 'name_en',
    default: 'name_en',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'name_en';

  @ApiPropertyOptional({
    description: 'Saralash tartibi',
    enum: ['asc', 'desc'],
    default: 'asc',
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'asc';
}