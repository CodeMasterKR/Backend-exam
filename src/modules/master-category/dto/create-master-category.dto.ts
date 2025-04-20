import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsPositive,
} from 'class-validator';

export class CreateMasterCategoryDto {
  @ApiProperty({
    example: 'Santexnika',
    description: 'Kategoriya nomi (O\'zbekcha)',
  })
  @IsNotEmpty()
  @IsString()
  name_uz: string;

  @ApiProperty({
    example: 'Plumbing',
    description: 'Kategoriya nomi (Inglizcha)',
  })
  @IsNotEmpty()
  @IsString()
  name_en: string;

  @ApiProperty({
    example: 'Сантехника',
    description: 'Kategoriya nomi (Ruscha)',
  })
  @IsNotEmpty()
  @IsString()
  name_ru: string;

  @ApiProperty({ 
    example: 'https://cdn.example.com/icons/plumbing.png',
    description: 'Kategoriya ikonasi (URL yoki identifikator)',
  })
  @IsNotEmpty()
  @IsString()
  icon: string; 

  @ApiProperty({
    example: 50000.0,
    description: 'Minimal soatlik ish haqi',
    type: Number,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  minWorkingHourlyPrice: number;

  @ApiProperty({ 
    example: 400000.0,
    description: 'Minimal kunlik narx',
    type: Number,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  minPriceDaily: number; 
}