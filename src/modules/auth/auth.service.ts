import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { totp } from 'otplib';
import * as bcrypt from 'bcrypt';
import { ActivateDto } from './dto/activate.dto';
import { loginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { sendOtpDto } from './dto/send-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forget-password.dto';
import { User, userRole } from '@prisma/client';
import { Request } from 'express';

@Injectable()
export class AuthService {
  private readonly otpKEY = process.env.OTP_KEY;
  private readonly accessKEY = process.env.ACCESS_KEY;
  private readonly refreshKEY = process.env.REFRESH_KEY;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {
    if (!this.otpKEY || !this.accessKEY || !this.refreshKEY) {
      throw new Error('Missing required environment variables');
    }
    totp.options = { step: 300, digits: 6 }; 
  }

  private async generateOtp(phone: string): Promise<string> {
    const user = await this.prisma.user.findFirst({ where: { phone } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return totp.generate(this.otpKEY + phone); 
  }

  async register(registerDto: RegisterDto): Promise<{ message: string; otp: string }> {
    const { phone, password, regionId } = registerDto;
    try {
      const existingUser = await this.prisma.user.findFirst({ where: { phone } });
      if (existingUser) {
        throw new ConflictException('This phone already exists');
      }

      const existingRegion = await this.prisma.region.findFirst({ where: { id: regionId } });
      if (!existingRegion) {
        throw new BadRequestException('Bunday IDli region topilmadi!');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await this.prisma.user.create({
        data: {
          ...registerDto,
          password: hashedPassword,
          userStatus: 'INACTIVE',
        },
      });
      
      const otp = await this.generateOtp(phone);
      return { message: 'Registration successful, please activate your account', otp };
    } catch (error) {
      if (error instanceof ConflictException || BadRequestException) {
        throw error;
      }
      console.error(`Registration failed for ${phone}:`, error);
      throw new InternalServerErrorException('Failed to register');
    }
  }

  async activate(activateDto: ActivateDto): Promise<{ message: string }> {
    const { phone, otp } = activateDto;
    try {
      const user = await this.prisma.user.findFirst({ where: { phone } });
      if (!user) {
        throw new BadRequestException('Invalid phone or OTP');
      }

      const isCorrect = totp.check(otp, this.otpKEY + phone); 
      if (!isCorrect) {
        throw new BadRequestException('OTP xato');
      }

      await this.prisma.user.update({
        where: { id: user.id },
        data: { userStatus: 'ACTIVE' },
      });

      return { message: 'Account successfully activated' };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      console.error(`Account activation failed for ${phone}:`, error);
      throw new InternalServerErrorException('Failed to activate account');
    }
  }

  async login(loginDto: loginDto, req: Request): Promise<{ access: string; refresh: string }> {
    const { phone, password } = loginDto;
    try {
      const user = await this.prisma.user.findFirst({ where: { phone } });
      if (!user) {
        throw new BadRequestException('Invalid phone or password');
      }

      const isCorrect = await bcrypt.compare(password, user.password);
      if (!isCorrect) {
        throw new BadRequestException('Invalid phone or password');
      }

      // if (user.userStatus === 'INACTIVE') {
      //   throw new BadRequestException('Your account is not active');
      // }

      // await this.prisma.session.create({
      //   data: {
      //     ipAddress: req.ip,
      //     userId: user.id,
      //     deviceInfo: req.headers['user-agent'] || 'Unknown Device',
      //   },
      // });

      const payload = { id: user.id, role: user.userRole, status: user.userStatus };
      const refreshToken = this.genRefreshToken(payload);
      const accessToken = this.genAccessToken(payload);

      return { access: accessToken, refresh: refreshToken };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error(`Login failed for ${phone}:`, error);
      throw new InternalServerErrorException('Failed to login');
    }
  }

  async sendOTP(sendOtpDto: sendOtpDto): Promise<{ message: string; otp: string }> {
    const { phone } = sendOtpDto;
    try {
      const otp = await this.generateOtp(phone);
      return { message: 'OTP sent successfully', otp };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException('Invalid phone');
      }
      console.error(`OTP generation failed for ${phone}:`, error);
      throw new InternalServerErrorException('Failed to generate OTP');
    }
  }

  async forgetPassword(forgetPassword: ForgotPasswordDto): Promise<{ message: string; otp: string }> {
    const { phone } = forgetPassword;
    try {
      const otp = await this.generateOtp(phone);
      return { message: 'OTP sent for password reset', otp };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException('Invalid phone');
      }
      console.error(`Password reset OTP generation failed for ${phone}:`, error);
      throw new InternalServerErrorException('Failed to generate OTP');
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<Omit<User, 'password'>> {
    const { phone, otp, newPassword } = resetPasswordDto;
    try {
      const user = await this.prisma.user.findFirst({ where: { phone } });
      if (!user) {
        throw new BadRequestException('Invalid phone or OTP');
      }

      const isCorrect = totp.check(otp, this.otpKEY + phone); 
      if (!isCorrect) {
        throw new BadRequestException('OTP xato');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updatedUser = await this.prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      const { password, ...result } = updatedUser;
      return result;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error(`Password reset failed for ${phone}:`, error);
      throw new InternalServerErrorException('Failed to reset password');
    }
  }

  private genRefreshToken(payload: object): string {
    return this.jwtService.sign(payload, {
      secret: this.refreshKEY,
      expiresIn: '30d',
    });
  }

  private genAccessToken(payload: object): string {
    return this.jwtService.sign(payload, {
      secret: this.accessKEY,
      expiresIn: '1h',
    });
  }
}