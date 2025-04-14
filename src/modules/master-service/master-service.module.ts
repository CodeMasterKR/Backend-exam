import { Module } from '@nestjs/common';
import { MasterServiceService } from './master-service.service';
import { MasterServiceController } from './master-service.controller';

@Module({
  controllers: [MasterServiceController],
  providers: [MasterServiceService],
})
export class MasterServiceModule {}
