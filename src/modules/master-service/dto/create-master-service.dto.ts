import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsUUID,
  IsOptional,
  IsInt,
  Min,
  IsNumber,
  IsPositive,
} from 'class-validator';

export class CreateMasterServiceDto {
  @ApiProperty({
    description: 'ID of the related MasterCategory',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsString()
  @IsUUID()
  masterCategoryId: string;

  @ApiProperty({
    description: 'ID of the related Master (user)',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsString()
  @IsUUID()
  masterId: string;

  @ApiPropertyOptional({
    description: 'Minimum working hours required for this service (optional)',
    example: 2,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  minWorkingHours?: number;

  @ApiPropertyOptional({
    description:
      'Hourly price for the service (optional, must be >= MasterCategory minWorkingHourlyPrice)',
    example: 50.0,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive() // Narx manfiy bo'lishi mumkin emas
  priceHourly?: number;

  @ApiPropertyOptional({
    description:
      'Daily price for the service (optional, must be >= MasterCategory minPriceDaily)',
    example: 350.0,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive() // Narx manfiy bo'lishi mumkin emas
  priceDaily?: number;

  @ApiPropertyOptional({
    description: 'Years of experience specific to this service category (optional)',
    example: 3,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  experience?: number;
}