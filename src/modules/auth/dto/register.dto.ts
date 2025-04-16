import { IsString, IsNotEmpty, Length, Matches, IsOptional, IsEnum, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { userRole } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({
    description: "Foydalanuvchining yoki mas'ul shaxsning ismi",
    example: 'Kamron',
  })
  @IsString({ message: "Ism matn bo'lishi kerak" })
  @IsNotEmpty({ message: "Ism bo'sh bo'lmasligi kerak" })
  firstName: string;

  @ApiProperty({
    description: "Foydalanuvchining yoki mas'ul shaxsning familiyasi",
    example: 'Ibrohimov',
  })
  @IsString({ message: "Familiya matn bo'lishi kerak" })
  @IsNotEmpty({ message: "Familiya bo'sh bo'lmasligi kerak" })
  lastName: string;

  @ApiProperty({
    description: "Foydalanuvchining yoki mas'ul shaxsning otasining ismi (ixtiyoriy)",
    example: 'Rajabboy o\'gli',
    required: false,
  })
  @IsOptional()
  @IsString({ message: "Otasining ismi matn bo'lishi kerak" })
  middleName?: string;

  @ApiProperty({
    description: "Telefon raqam (+998XXXXXXXXX formatida)",
    example: '+998945895766',
  })
  @IsString()
  @IsNotEmpty({ message: "Telefon raqam bo'sh bo'lmasligi kerak" })
  @Matches(/^\+998\d{9}$/, { message: "Telefon raqam +998XXXXXXXXX formatida bo'lishi kerak" })
  phone: string;

  @ApiProperty({
    description: "Foydalanuvchi paroli (6-20 belgi oralig'ida)",
    example: '123456',
    minLength: 6,
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty({ message: "Parol bo'sh bo'lmasligi kerak" })
  @Length(6, 20, { message: "Parol uzunligi 6 va 20 orasida bo'lishi kerak" })
  password: string;

  @ApiProperty({
    description: "Region idsi",
    example: 'uuid()',
  })
  @IsString({ message: "Id matn bo'lishi kerak" })
  @IsNotEmpty({ message: "Id bo'sh bo'lmasligi kerak" })
  regionId: string;

  @ApiProperty({
    description: "Foydalanuvchi turi (JISMONIY yoki YURIDIK)",
    enum: userRole,
    example: userRole.JISMONIY,
  })
  @IsEnum(userRole, { message: `Foydalanuvchi turi noto'g'ri. Mumkin bo'lgan qiymatlar: ${Object.values(userRole).join(', ')}` })
  @IsNotEmpty({ message: "Foydalanuvchi turi tanlanishi kerak" })
  userRole: userRole;

  @ApiProperty({
    description: "Tashkilotning STIR (INN) raqami (9 ta raqam). Faqat userRole='YURIDIK' bo'lganda majburiy.",
    example: '123456789',
    required: false,
    maxLength: 9,
    minLength: 9,
    pattern: '^[0-9]{9}$',
  })
  @IsOptional()
  @ValidateIf(o => o.userRole === userRole.YURIDIK)
  @IsNotEmpty({ message: "Yuridik shaxs uchun STIR (INN) kiritilishi shart" })
  @Length(9, 9, { message: "STIR (INN) uzunligi 9 ta raqam bo'lishi kerak" })
  @Matches(/^[0-9]{9}$/, { message: "STIR (INN) faqat raqamlardan iborat bo'lishi kerak" })
  @IsString()
  TIN?: string;

  @ApiProperty({
    description: "Xizmat ko'rsatuvchi bank kodi (MFO) (5 ta raqam). Faqat userRole='YURIDIK' bo'lganda majburiy.",
    example: '00450',
    required: false,
    maxLength: 5,
    minLength: 5,
    pattern: '^[0-9]{5}$',
  })
  @IsOptional()
  @ValidateIf(o => o.userRole === userRole.YURIDIK)
  @IsNotEmpty({ message: "Yuridik shaxs uchun Bank kodi (MFO) kiritilishi shart" })
  @Length(5, 5, { message: "Bank kodi (MFO) uzunligi 5 ta raqam bo'lishi kerak" })
  @Matches(/^[0-9]{5}$/, { message: "Bank kodi (MFO) faqat raqamlardan iborat bo'lishi kerak" })
  @IsString()
  bankCode?: string;

  @ApiProperty({
    description: "Tashkilotning bank hisob raqami (20 ta raqam). Faqat userRole='YURIDIK' bo'lganda majburiy.",
    example: '20210000123456789012',
    required: false,
    maxLength: 20,
    minLength: 20,
    pattern: '^[0-9]{20}$',
  })
  @IsOptional()
  @ValidateIf(o => o.userRole === userRole.YURIDIK)
  @IsNotEmpty({ message: "Yuridik shaxs uchun Bank hisob raqami kiritilishi shart" })
  @Length(20, 20, { message: "Bank hisob raqami uzunligi 20 ta raqam bo'lishi kerak" })
  @Matches(/^[0-9]{20}$/, { message: "Bank hisob raqami faqat raqamlardan iborat bo'lishi kerak" })
  @IsString()
  bankAccountNumber?: string;

  @ApiProperty({
    description: "Xizmat ko'rsatuvchi bank nomi. Faqat userRole='YURIDIK' bo'lganda majburiy.",
    example: 'Kapitalbank ATB',
    required: false,
  })
  @IsOptional()
  @ValidateIf(o => o.userRole === userRole.YURIDIK)
  @IsNotEmpty({ message: "Yuridik shaxs uchun Bank nomi kiritilishi shart" })
  @IsString()
  bankName?: string;

  @ApiProperty({
    description: "Iqtisodiy faoliyat turi kodi (IFUT/OKED) (ixtiyoriy)",
    example: '62010',
    required: false,
  })
  @IsOptional()
  @ValidateIf(o => o.userRole === userRole.YURIDIK || o.economicActivityCode)
  @IsString({ message: "Iqtisodiy faoliyat kodi (IFUT) matn bo'lishi kerak" })
  economicActivityCode?: string;
}