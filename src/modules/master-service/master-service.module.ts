import { Module } from '@nestjs/common';
import { MasterServiceService } from './master-service.service';
import { MasterServiceController } from './master-service.controller';
import { PrismaModule } from '../../config/prisma/prisma.module';
import { AuthModule } from '../auth/auth.module'; 

@Module({
  imports: [
    PrismaModule, 
    AuthModule, 
  ],
  controllers: [MasterServiceController],
  providers: [MasterServiceService],
  exports: [MasterServiceService], 
})
export class MasterServiceModule {}