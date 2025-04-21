import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAttributeDto {
  @ApiProperty({ description: 'Name of the attribute' })
  @IsString()
  @IsNotEmpty()
  name: string;
}