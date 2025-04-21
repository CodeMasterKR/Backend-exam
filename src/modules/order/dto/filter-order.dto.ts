import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min, Max, IsString, IsIn, IsBoolean, IsUUID, IsEnum } from 'class-validator';
import { paymentStatus } from '@prisma/client';

export class FilterOrderDto {
  @ApiPropertyOptional({ description: 'Page number for pagination', minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Number of items per page', minimum: 1, maximum: 100, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Field to sort by', example: 'createdAt', enum: ['createdAt', 'status', 'paymentStatus', 'isCompleted'] })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({ description: 'Sort order', enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';

  @ApiPropertyOptional({ description: 'Filter by User ID (UUID)' })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({ description: 'Filter by Cart ID (UUID)' })
  @IsOptional()
  @IsUUID()
  cartId?: string;

  @ApiPropertyOptional({ description: 'Filter by payment status', enum: paymentStatus })
  @IsOptional()
  @IsEnum(paymentStatus)
  paymentStatus?: paymentStatus;

  @ApiPropertyOptional({ description: 'Filter by order status (exact match or contains)', example: 'PROCESSING' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Filter by delivery option' })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  withDelivery?: boolean;

  @ApiPropertyOptional({ description: 'Filter by completion status' })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isCompleted?: boolean;
}