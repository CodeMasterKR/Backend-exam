import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaModule } from '../../config/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config'; 
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
      PrismaModule,
      ConfigModule,
      AuthModule
    ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService]
})
export class OrderModule {}