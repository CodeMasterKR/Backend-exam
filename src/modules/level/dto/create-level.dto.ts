import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateLevelDto {
  @ApiProperty({
    description: 'Level name in Uzbek',
    example: 'Boshlang\'ich',
  })
  @IsString()
  @IsNotEmpty()
  name_uz: string;

  @ApiProperty({
    description: 'Level name in English',
    example: 'Beginner',
  })
  @IsString()
  @IsNotEmpty()
  name_en: string;

  @ApiProperty({
    description: 'Level name in Russian',
    example: 'Начальный',
  })
  @IsString()
  @IsNotEmpty()
  name_ru: string;

  @ApiProperty({
    description: 'ID of the related MasterCategory',
    example: 'uuid',
  })
  @IsString()
  @IsUUID()
  masterCategoryId: string;
}