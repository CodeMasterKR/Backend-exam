import { Module } from '@nestjs/common';
import { LevelService } from './level.service';
import { LevelController } from './level.controller';
import { PrismaModule } from '../../config/prisma/prisma.module'; 

@Module({
  imports: [
    PrismaModule,
  ],
  controllers: [LevelController],
  providers: [LevelService],
  exports: [LevelService], 
})
export class LevelModule {}