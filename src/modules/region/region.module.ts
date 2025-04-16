import { Module } from '@nestjs/common';
import { RegionService } from './region.service';
import { RegionController } from './region.controller';
import { PrismaModule } from '../../config/prisma/prisma.module'
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, 
    JwtModule.register({
    secret: process.env.ACCESS_KEY, 
    signOptions: { expiresIn: '1h' }, 
  }),],
  controllers: [RegionController],
  providers: [RegionService],
})
export class RegionModule {}
