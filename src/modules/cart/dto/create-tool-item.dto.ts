import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateToolItemDto {
  @ApiProperty({ example: 'uuid', description: 'Tool Attribute ID' }) 
  @IsString()
  @IsNotEmpty()
  toolAttributeId: string;

  @ApiProperty({ example: 5, description: 'Count of the tool item', minimum: 1 }) 
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  count: number;
}