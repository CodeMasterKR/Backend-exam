import { Module } from '@nestjs/common';
import { ToolAttributeService } from './tool-attribute.service';
import { ToolAttributeController } from './tool-attribute.controller';
import { PrismaModule } from 'src/config/prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
  ],
  controllers: [ToolAttributeController],
  providers: [ToolAttributeService],
  exports: [ToolAttributeService], 
})
export class ToolAttributeModule {}