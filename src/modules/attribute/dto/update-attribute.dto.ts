import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAttributeDto {
  @ApiProperty({ description: 'Name of the attribute', required: false })
  @IsString()
  @IsOptional()
  name?: string;
}