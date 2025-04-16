import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsPhoneNumber, Matches } from "class-validator";

export class ActivateDto {
  @ApiProperty({
    description: 'Foydalanuvchining telefon raqami (O\'zbekiston formatida)', 
    example: '+998945895766',
  })
  @IsNotEmpty({ message: 'Telefon raqami kiritilishi shart' })
  @IsPhoneNumber('UZ', { message: 'Telefon raqami O\'zbekiston formatida (+998...) bo\'lishi kerak' }) 
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'SMS orqali yuborilgan bir martalik parol (OTP)',
    example: '123456',
  })
  @IsNotEmpty({ message: 'OTP kodi kiritilishi shart' })
  @IsString({ message: 'OTP kodi matn (string) bo\'lishi kerak' })
  @Matches(/^[0-9]{6}$/, { message: 'OTP kodi 6 ta raqamdan iborat bo\'lishi kerak' }) 
  otp: string;
}