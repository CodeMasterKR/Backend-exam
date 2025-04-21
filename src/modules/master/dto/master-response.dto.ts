import { ApiProperty } from '@nestjs/swagger';
import { Master } from '@prisma/client'; 

export class MasterResponseDto implements Omit<Master, 'passportImage'> { 
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Ibrohimov Kamron' })
  fullName: string;

  @ApiProperty({ example: '+998945895766' })
  phone: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '10-09-2003' })
  dateBirth: string; 

  @ApiProperty({ example: 5 })
  experience: number;

  @ApiProperty({ example: 'https://example.com/images/master.jpg' })
  image: string;

  @ApiProperty({ example: 4.5, nullable: true })
  star: number | null;

  @ApiProperty({ example: 'student...' })
  about: string;

  @ApiProperty({ example: 'uuid' })
  masterCategoryId: string;
}

export class PaginatedMasterResponseDto {
    @ApiProperty({ type: [MasterResponseDto] })
    data: MasterResponseDto[];

    @ApiProperty({ description: 'Total number of items found', example: 100 })
    total: number;

    @ApiProperty({ description: 'Current page number', example: 1 })
    page: number;

    @ApiProperty({ description: 'Number of items per page', example: 10 })
    limit: number;

    @ApiProperty({ description: 'Total number of pages', example: 10 })
    totalPages: number;
}