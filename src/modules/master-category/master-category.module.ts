import { Module } from '@nestjs/common';
import { MasterCategoryService } from './master-category.service';
import { MasterCategoryController } from './master-category.controller';
import { PrismaModule } from 'src/config/prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
  ],
  controllers: [MasterCategoryController],
  providers: [MasterCategoryService],
  exports: [MasterCategoryService],
})
export class MasterCategoryModule {}
