import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateToolAttributeDto {
  @ApiProperty({
    description: 'The ID of the related Tool',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsNotEmpty()
  @IsUUID()
  toolId: string;

  @ApiProperty({
    description: 'The ID of the related Attribute',
    example: 'e1b2c3d4-a5f6-7890-1234-567890abcdef',
  })
  @IsNotEmpty()
  @IsUUID()
  attributeId: string;

  @ApiProperty({
    description: 'The value of the attribute for the specific tool',
    example: '10mm',
  })
  @IsNotEmpty()
  @IsString()
  value: string;
}