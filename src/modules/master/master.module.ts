import { Module } from '@nestjs/common';
import { MasterService } from './master.service';
import { MasterController } from './master.controller';
import { PrismaModule } from '../../config/prisma/prisma.module'; 
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    PrismaModule, 
    AuthModule, 
  ],
  controllers: [MasterController],
  providers: [MasterService],
  exports: [MasterService]
})
export class MasterModule {}