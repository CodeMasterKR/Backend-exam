import { IsString, IsNotEmpty, Length, Matches, IsOptional, IsEnum, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class loginDto {

  @ApiProperty({
    description: "Telefon raqam (+998XXXXXXXXX formatida)",
    example: '+998901234567',
  })
  @IsString()
  @IsNotEmpty({ message: "Telefon raqam bo'sh bo'lmasligi kerak" })
  @Matches(/^\+998\d{9}$/, { message: "Telefon raqam +998XXXXXXXXX formatida bo'lishi kerak" })
  phone: string;

  @ApiProperty({
    description: "Foydalanuvchi paroli (6-20 belgi oralig'ida)",
    example: 'parol123!',
    minLength: 6,
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty({ message: "Parol bo'sh bo'lmasligi kerak" })
  @Length(6, 20, { message: "Parol uzunligi 6 va 20 orasida bo'lishi kerak" })
  password: string;

}
