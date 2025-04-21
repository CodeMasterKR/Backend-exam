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
    example: 'uuid',
  })
  @IsString()
  @IsUUID()
  masterCategoryId: string;

  @ApiProperty({
    description: 'ID of the related Master (user)',
    example: 'uuid',
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
  @IsPositive()
  priceHourly?: number;

  @ApiPropertyOptional({
    description:
      'Daily price for the service (optional, must be >= MasterCategory minPriceDaily)',
    example: 350.0,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive() 
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