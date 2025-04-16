import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRegionDto {
  @ApiProperty({
    example: 'Toshkent viloyati',
    description: 'Yangi region nomi',
    required: true,
  })
  @IsString({ message: 'Nomi matn (string) bo\'lishi kerak!' })
  @IsNotEmpty({ message: 'Nomi bo\'sh bo\'lishi mumkin emas!' })
  name: string;
}