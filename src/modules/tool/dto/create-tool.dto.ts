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
  @IsString() // Consider using IsUrl if it must be a URL
  image?: string;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  @IsString()
  @IsUUID()
  toolSubCategoryId: string; // Changed from toolSubCategoryId to match model

  @ApiPropertyOptional({ example: 'review-uuid-123' })
  @IsOptional()
  @IsString() // Assuming it's just an ID string for now
  toolReviewId?: string;
}