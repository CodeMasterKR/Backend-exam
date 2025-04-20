import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { userRole, userStatus } from '@prisma/client';

export class RegisterAdminDto {
  @ApiProperty({ description: 'Adminning ismi', example: 'Kamron' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'Adminning familiyasi', example: 'Ibrohimov' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ description: 'Adminning otasining ismi (ixtiyoriy)', example: 'Rajabboyovich', required: false })
  @IsString()
  @IsOptional()
  middleName?: string;

  @ApiProperty({ description: 'Adminning telefon raqami', example: '++998945895766' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ description: 'Adminning paroli', example: '123456' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: 'Adminning region IDsi', example: 'uuid' })
  @IsString()
  @IsNotEmpty()
  regionId: string;

  @ApiProperty({
    description: 'Adminning roli',
    enum: userRole,
    example: userRole.ADMIN,
  })
  @IsEnum(userRole)
  @IsNotEmpty()
  userRole: userRole;

  @ApiProperty({
    description: 'Adminning holati',
    enum: userStatus,
    example: userStatus.INACTIVE,
    required: false,
  })
  @IsEnum(userStatus)
  @IsOptional()
  userStatus?: userStatus;
}