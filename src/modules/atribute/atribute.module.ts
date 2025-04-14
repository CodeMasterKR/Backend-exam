import { Module } from '@nestjs/common';
import { AtributeService } from './atribute.service';
import { AtributeController } from './atribute.controller';

@Module({
  controllers: [AtributeController],
  providers: [AtributeService],
})
export class AtributeModule {}
