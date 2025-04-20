import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min, Max, IsString, IsIn, IsBoolean } from 'class-validator';

export class QueryMasterDto {
  @ApiPropertyOptional({
    description: 'Qidiruv satri (fullName, phone, about boʻyicha qidiradi)',
    example: 'John',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Sahifa raqami',
    default: 1,
    minimum: 1,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number) // Query parametri string bo'lgani uchun Numberga o'tkazamiz
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Har bir sahifadagi elementlar soni',
    default: 10,
    minimum: 1,
    maximum: 100,
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100) // Server yuklamasini cheklash uchun maximum qo'yamiz
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Saralash maydoni',
    enum: ['fullName', 'experience', 'star', 'dateBirth', 'createdAt'], // createdAt qo'shilishi mumkin
    default: 'fullName',
    example: 'experience',
  })
  @IsOptional()
  @IsString()
  @IsIn(['fullName', 'experience', 'star', 'dateBirth', 'createdAt']) // Ruxsat etilgan maydonlar
  sortBy?: string = 'fullName';

  @ApiPropertyOptional({
    description: 'Saralash tartibi',
    enum: ['asc', 'desc'],
    default: 'asc',
    example: 'desc',
  })
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'asc';

   @ApiPropertyOptional({
    description: 'Faqat aktiv masterlarni filtrlash',
    example: true,
    type: Boolean
  })
  @IsOptional()
  @Type(() => Boolean) // Query parametri 'true'/'false' string bo'lishi mumkin
  @IsBoolean()
  isActive?: boolean;
}