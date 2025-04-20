import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateToolCategoryDto {
  @ApiProperty({ description: 'Nomi (Uzbek)', example: 'Qurilish asboblari' })
  @IsString()
  @IsNotEmpty()
  name_uz: string;

  @ApiProperty({ description: 'Nomi (English)', example: 'Construction Tools' })
  @IsString()
  @IsNotEmpty()
  name_en: string;

  @ApiProperty({ description: 'Nomi (Russian)', example: 'Строительные инструменты' })
  @IsString()
  @IsNotEmpty()
  name_ru: string;

  @ApiPropertyOptional({ description: 'Tavsifi (Uzbek)', example: '...' })
  @IsOptional()
  @IsString()
  desc_uz?: string;

  @ApiPropertyOptional({ description: 'Tavsifi (English)', example: '...' })
  @IsOptional()
  @IsString()
  desc_en?: string;

  @ApiPropertyOptional({ description: 'Tavsifi (Russian)', example: '...' })
  @IsOptional()
  @IsString()
  desc_ru?: string;

  @ApiPropertyOptional({ description: 'Ikona URL yoki belgisi', example: 'icon-construction' })
  @IsOptional()
  @IsString()
  icon?: string;
}