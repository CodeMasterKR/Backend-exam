import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from '../auth/dto/register.dto';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService){}
  
  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  
  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
