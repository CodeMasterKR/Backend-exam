import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    description: "Parolni tiklash jarayonini boshlash uchun O'zbekiston telefon raqami (+998XXYYYYYYY formatida kiritish tavsiya etiladi)",
    example: '+998945895766', 
  })
  @IsNotEmpty({ message: 'Telefon raqami kiritilishi shart.' })
  @IsPhoneNumber('UZ', { message: "Kiritilgan raqam O'zbekiston telefon raqami formatiga mos kelmadi yoki yaroqsiz." })
  @IsString() 
  phone: string;
}