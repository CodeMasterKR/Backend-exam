import { Module } from '@nestjs/common';
import { MasterServiceService } from './master-service.service';
import { MasterServiceController } from './master-service.controller';
import { PrismaModule } from '../../config/prisma/prisma.module'; // PrismaModule manzilingizni moslang
import { AuthModule } from '../auth/auth.module'; // AuthModule manzilingizni moslang (JWT Guard uchun)

@Module({
  imports: [
    PrismaModule, 
    AuthModule, 
  ],
  controllers: [MasterServiceController],
  providers: [MasterServiceService],
  exports: [MasterServiceService], // Agar boshqa modullar bu servisni ishlatsa
})
export class MasterServiceModule {}