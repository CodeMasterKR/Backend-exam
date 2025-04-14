import { Module } from '@nestjs/common';
import { ToolCategoryService } from './tool-category.service';
import { ToolCategoryController } from './tool-category.controller';

@Module({
  controllers: [ToolCategoryController],
  providers: [ToolCategoryService],
})
export class ToolCategoryModule {}
