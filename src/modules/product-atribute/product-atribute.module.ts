import { Module } from '@nestjs/common';
import { ProductAtributeService } from './product-atribute.service';
import { ProductAtributeController } from './product-atribute.controller';

@Module({
  controllers: [ProductAtributeController],
  providers: [ProductAtributeService],
})
export class ProductAtributeModule {}
