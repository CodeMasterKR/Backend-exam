import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsInt, Min, IsIn } from 'class-validator';

export class QueryToolCategoryDto {
  @ApiPropertyOptional({ description: 'Sahifa raqami', default: 1, type: Number })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Sahifadagi elementlar soni', default: 10, type: Number })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Qidiruv matni (nom yoki tavsif bo\'yicha)', example: 'qurilish' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Saralash maydoni', example: 'name_en', default: 'name_en' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'name_en';

  @ApiPropertyOptional({ description: 'Saralash tartibi', enum: ['asc', 'desc'], default: 'asc' })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'asc';
}