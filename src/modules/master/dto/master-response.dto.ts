import { ApiProperty } from '@nestjs/swagger';
import { Master } from '@prisma/client'; // Prisma modelini import qilish

// Bu DTO javob strukturasini Swaggerda aniq ko'rsatish uchun
export class MasterResponseDto implements Omit<Master, 'passportImage'> { // Masalan, passportImage ni qaytarmaymiz
  @ApiProperty({ example: 'c1b7e1a0-5c3a-4b1e-8f0a-1b2c3d4e5f6a' })
  id: string;

  @ApiProperty({ example: 'John Doe' })
  fullName: string;

  @ApiProperty({ example: '+998901234567' })
  phone: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '1990-05-15T00:00:00.000Z' })
  dateBirth: string; // Javobda Date bo'lishi mumkin

  @ApiProperty({ example: 5 })
  experience: number;

  @ApiProperty({ example: 'https://example.com/images/master.jpg' })
  image: string;

  // passportImage ni chiqarib tashladik

  @ApiProperty({ example: 4.5, nullable: true })
  star: number | null;

  @ApiProperty({ example: 'Experienced hairdresser...' })
  about: string;

  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  masterCategoryId: string;

  // Agar createdAt/updatedAt bo'lsa, ularni ham qo'shish mumkin
  // @ApiProperty()
  // createdAt: Date;
  // @ApiProperty()
  // updatedAt: Date;
}


// Pagination javobi uchun DTO
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