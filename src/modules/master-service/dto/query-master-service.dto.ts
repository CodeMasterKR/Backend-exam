import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsInt, Min, IsIn, IsUUID } from 'class-validator';

export class QueryMasterServiceDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    default: 1,
    type: Number,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    default: 10,
    type: Number,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Search term (currently not implemented for deep search)',
    example: 'some keyword',
  })
  @IsOptional()
  @IsString()
  search?: string; 

  @ApiPropertyOptional({
    description: 'Field to sort by',
    example: 'priceHourly',
    default: 'id', 
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'id'; 

  @ApiPropertyOptional({
    description: 'Sort order',
    enum: ['asc', 'desc'],
    default: 'asc',
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'asc';

  @ApiPropertyOptional({
    description: 'Filter by Master ID',
    example: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  masterId?: string;

  @ApiPropertyOptional({
    description: 'Filter by MasterCategory ID',
    example: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  masterCategoryId?: string;
}