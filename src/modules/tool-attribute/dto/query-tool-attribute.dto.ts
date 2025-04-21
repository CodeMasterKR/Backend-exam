import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsUUID, Min, IsInt, IsIn } from 'class-validator';

export class QueryToolAttributeDto {
  @ApiPropertyOptional({ description: 'Filter by Tool ID' })
  @IsOptional()
  @IsUUID()
  toolId?: string;

  @ApiPropertyOptional({ description: 'Filter by Attribute ID' })
  @IsOptional()
  @IsUUID()
  attributeId?: string;

  @ApiPropertyOptional({ description: 'Filter by partial value match' })
  @IsOptional()
  @IsString()
  value?: string;

  @ApiPropertyOptional({ description: 'Page number for pagination', default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Number of items per page', default: 10, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Field to sort by', example: 'value' })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({ description: 'Sort order', enum: ['asc', 'desc'], default: 'asc' })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc' = 'asc';
}