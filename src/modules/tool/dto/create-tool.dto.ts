import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsPositive,
  IsInt,
  Min,
  IsBoolean,
  IsUUID,
} from 'class-validator';

export class CreateToolDto {
  @ApiProperty({ example: 'Bolg\'a 200g' })
  @IsString()
  @IsNotEmpty()
  name_uz: string;

  @ApiProperty({ example: 'Hammer 200g' })
  @IsString()
  @IsNotEmpty()
  name_en: string;

  @ApiProperty({ example: 'Молоток 200г' })
  @IsString()
  @IsNotEmpty()
  name_ru: string;

  @ApiPropertyOptional({ example: 'Yog\'och dastali bolg\'a' })
  @IsOptional()
  @IsString()
  desc_uz?: string;

  @ApiPropertyOptional({ example: 'Hammer with wooden handle' })
  @IsOptional()
  @IsString()
  desc_en?: string;

  @ApiPropertyOptional({ example: 'Молоток с деревянной ручкой' })
  @IsOptional()
  @IsString()
  desc_ru?: string;

  @ApiProperty({ example: 25000.0 })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ example: 150 })
  @IsInt()
  @Min(0)
  quantity: number;

  @ApiPropertyOptional({ example: 'Bosch' })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 'https://example.com/images/hammer.jpg' })
  @IsOptional()
  @IsString() 
  image?: string;

  @ApiProperty({ example: 'uuid' })
  @IsString()
  @IsUUID()
  toolSubCategoryId: string; 

  @ApiPropertyOptional({ example: 'uuid' })
  @IsOptional()
  @IsString() 
  toolReviewId?: string;
}