import { Module } from '@nestjs/common';
import { ToolItemService } from './tool-item.service';
import { ToolItemController } from './tool-item.controller';

@Module({
  controllers: [ToolItemController],
  providers: [ToolItemService],
})
export class ToolItemModule {}
