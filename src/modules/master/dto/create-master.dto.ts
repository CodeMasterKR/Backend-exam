import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsPhoneNumber,
  IsBoolean,
  IsDateString,
  IsInt,
  Min,
  IsOptional,
  IsNumber,
  Max,
  IsUrl, // Agar image/passportImage URL bo'lsa
} from 'class-validator';

export class CreateMasterDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Masterning toʻliq ismi',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    example: '+998901234567',
    description: 'Masterning telefon raqami (xalqaro formatda)',
  })
  @IsPhoneNumber() // Mintaqangizga mos validatsiyani tanlang
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Master faolmi yoki yoʻqmi',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    example: '1990-05-15T00:00:00.000Z',
    description: 'Masterning tugʻilgan sanasi (ISO 8601 formatida)',
  })
  @IsNotEmpty()
  dateBirth: string; // Prisma DateTime ni qabul qiladi

  @ApiProperty({ example: 5, description: 'Masterning ish tajribasi (yillarda)' })
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  experience: number;

  @ApiProperty({
    example: 'https://example.com/images/master.jpg',
    description: 'Master rasmining URL manzili',
  })
  @IsString() // Yoki @IsUrl() agar URL bo'lishi shart bo'lsa
  @IsNotEmpty()
  image: string;

  @ApiProperty({
    example: 'https://example.com/images/passport.jpg',
    description: 'Master pasport rasmining URL manzili',
  })
  @IsString() // Yoki @IsUrl()
  @IsNotEmpty()
  passportImage: string;

  @ApiPropertyOptional({
    example: 4.5,
    description: 'Masterning reytingi (0 dan 5 gacha)',
    minimum: 0,
    maximum: 5,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  star?: number;

  @ApiProperty({
    example: 'Highly skilled master with 5 years of experience.',
    description: 'Master haqida qisqacha maʼlumot',
  })
  @IsString()
  @IsNotEmpty()
  about: string;
}