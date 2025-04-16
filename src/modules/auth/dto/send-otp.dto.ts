import { IsString, IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class sendOtpDto {

  @ApiProperty({
    description: "Telefon raqam (+998XXXXXXXXX formatida)",
    example: '+998945895766',
  })
  @IsString()
  @IsNotEmpty({ message: "Telefon raqam bo'sh bo'lmasligi kerak" })
  @Matches(/^\+998\d{9}$/, { message: "Telefon raqam +998XXXXXXXXX formatida bo'lishi kerak" })
  phone: string;
}
