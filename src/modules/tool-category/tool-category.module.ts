import { Module } from '@nestjs/common';
import { ToolCategoryService } from './tool-category.service';
import { ToolCategoryController } from './tool-category.controller';
import { PrismaModule } from '../../config/prisma/prisma.module'; 
import { AuthModule } from '../auth/auth.module';     

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ToolCategoryController],
  providers: [ToolCategoryService],
  exports: [ToolCategoryService],
})
export class ToolCategoryModule {}