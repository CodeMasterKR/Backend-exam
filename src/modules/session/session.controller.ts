import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { SessionService } from './session.service';
import { GetUser } from '../guards/get-user.decorator';
import { User } from '@prisma/client';

@Controller('sessions')
@UseGuards(JwtAuthGuard)
export class SessionController {
  constructor(private sessionService: SessionService) {}

  @Get()
  async getSessions(@GetUser() user: User) {
    return this.sessionService.getUserSessions(user.id);
  }
}