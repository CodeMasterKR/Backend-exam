import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Telefon raqam (+998XXXXXXXXX formatida)',
    example: '+998945895766',
  })
  @IsString()
  @IsNotEmpty({ message: "Telefon raqam bo'sh bo'lmasligi kerak" })
  @Matches(/^\+998\d{9}$/, {
    message: "Telefon raqam +998XXXXXXXXX formatida bo'lishi kerak",
  })
  phone: string;

  @ApiProperty({
    description: 'Telefon raqam orqali yuborilgan OTP kodi',
    example: '123456',
  })
  @IsNumberString(
    {},
    { message: "OTP faqat raqamlardan iborat bo'lishi kerak." },
  )
  @Length(6, 6, { message: "OTP kodi 6 ta raqamdan iborat bo'lishi kerak." })
  @IsNotEmpty({ message: 'OTP kodi kiritilishi shart.' })
  otp: string;

  @ApiProperty({
    description: "Foydalanuvchi paroli (6-20 belgi oralig'ida)",
    example: 'parol123!',
    minLength: 6,
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty({ message: "Parol bo'sh bo'lmasligi kerak" })
  @Length(6, 20, { message: "Parol uzunligi 6 va 20 orasida bo'lishi kerak" })
  newPassword: string;
}
