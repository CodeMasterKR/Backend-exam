import { Module } from '@nestjs/common';
import { AttributeService } from './attribute.service';
import { AttributeController } from './attribute.controller';

@Module({
  controllers: [AttributeController],
  providers: [AttributeService],
  exports: [AttributeService], 
})
export class AttributeModule {}