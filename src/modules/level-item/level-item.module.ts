import { Module } from '@nestjs/common';
import { LevelItemService } from './level-item.service';
import { LevelItemController } from './level-item.controller';

@Module({
  controllers: [LevelItemController],
  providers: [LevelItemService],
})
export class LevelItemModule {}
