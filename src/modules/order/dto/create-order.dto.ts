import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID, IsBoolean, IsOptional, IsEnum } from 'class-validator';
import { paymentStatus } from '@prisma/client'; 

export class CreateOrderDto {
  @ApiProperty({ description: 'User ID who placed the order', example: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Cart ID associated with the order', example: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  cartId: string;

  @ApiProperty({ description: 'Delivery location coordinates or identifier', example: '41.2995,69.2401' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ description: 'Detailed delivery address', example: 'Tashkent, Amir Temur str, 100' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiPropertyOptional({ description: 'Payment status', enum: paymentStatus, default: paymentStatus.PENDING, example: paymentStatus.PENDING })
  @IsEnum(paymentStatus)
  @IsOptional()
  paymentStatus?: paymentStatus = paymentStatus.PENDING;

  @ApiProperty({ description: 'Is delivery included?', example: true })
  @IsBoolean()
  @IsNotEmpty()
  withDelivery: boolean;

  @ApiProperty({ description: 'Current status of the order', example: 'PROCESSING' })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiPropertyOptional({ description: 'Optional comment for the delivery person', example: 'Call before arriving' })
  @IsString()
  @IsOptional()
  commentToDelivery?: string;

  @ApiProperty({ description: 'Has the order been completed?', example: false })
  @IsBoolean()
  @IsNotEmpty()
  isCompleted: boolean;
}