import { Module } from '@nestjs/common';
import { MasterService } from './master.service';
import { MasterController } from './master.controller';
import { PrismaModule } from '../../config/prisma/prisma.module'; // PrismaModule ni import qilish
// Agar JWT Guard shu modulda aniqlanmagan bo'lsa, AuthModule ni import qilish kerak bo'lishi mumkin
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    PrismaModule, // PrismaService ni taqdim etish uchun
    AuthModule, // Agar JwtAuthGuard shu yerdan kelsa
  ],
  controllers: [MasterController],
  providers: [MasterService],
  exports: [MasterService] // Agar boshqa modullar MasterService ni ishlatsa
})
export class MasterModule {}