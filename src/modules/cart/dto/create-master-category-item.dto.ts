import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateMasterCategoryItemDto {
  @ApiProperty({ example: 'uuid', description: 'Level ID' })
  @IsString()
  @IsNotEmpty()
  levelId: string;

  @ApiProperty({ example: 3, description: 'Count of the master category item', minimum: 1 })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  count: number;
}