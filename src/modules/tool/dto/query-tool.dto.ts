import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  IsIn,
  IsUUID,
  IsBoolean,
} from 'class-validator';

export class QueryToolDto {
  @ApiPropertyOptional({ default: 1, type: Number })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10, type: Number })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ example: 'hammer' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 'price', default: 'name_en' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'name_en';

  @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'asc' })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'asc';

  @ApiPropertyOptional({ example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', format: 'uuid' })
  @IsOptional()
  @IsUUID()
  toolSubCategoryId?: string; 

  @ApiPropertyOptional({ example: true, type: Boolean })
  @IsOptional()
  @Transform(({ value }) => value == 'true' || value == true)
  @IsBoolean()
  isActive?: boolean;

   @ApiPropertyOptional({ example: 'Bosch' })
   @IsOptional()
   @IsString()
   brand?: string;
}