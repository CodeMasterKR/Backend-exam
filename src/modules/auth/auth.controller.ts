import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
  Get,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { ActivateDto } from './dto/activate.dto';
import { loginDto } from './dto/login.dto';
import { sendOtpDto } from './dto/send-otp.dto';
import { ForgotPasswordDto } from './dto/forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Request } from 'express';
import { User } from '@prisma/client'; 
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { userRole } from 'src/common/enums/enum';
import { Roles } from '../guards/roles.decorator';
import { RegisterAdminDto } from './dto/register-admin.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'Registration successful, returns OTP for activation.',
    schema: { example: { message: 'Registration successful, please activate your account', otp: '123456' } },
  })
  @ApiResponse({ status: 409, description: 'Conflict - Phone number already exists.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error - Registration failed.' })
  async register(@Body() registerDto: RegisterDto): Promise<{ message: string; otp: string }> {
    return this.authService.register(registerDto);
  }

  @Post('activate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Activate user account using OTP' })
  @ApiBody({ type: ActivateDto })
  @ApiResponse({ status: 200, description: 'Account successfully activated.', schema: { example: { message: 'Account successfully activated' } } })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid phone, OTP, or expired OTP.' })
  @ApiResponse({ status: 404, description: 'Not Found - User not found (if activation logic changes).' }) // Added based on potential service errors
  @ApiResponse({ status: 500, description: 'Internal Server Error - Activation failed.' })
  async activate(@Body() activateDto: ActivateDto): Promise<{ message: string }> {
    return this.authService.activate(activateDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in a user' })
  @ApiBody({ type: loginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful, returns access and refresh tokens.',
    schema: {
      example: {
        access: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refresh: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid phone/password or inactive account.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error - Login failed.' })
  async login(
    @Body() loginDto: loginDto,
    @Req() req: Request,
  ): Promise<{ access: string; refresh: string }> {
    return this.authService.login(loginDto, req);
  }

  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send OTP to a registered user\'s phone' })
  @ApiBody({ type: sendOtpDto })
  @ApiResponse({ status: 200, description: 'OTP sent successfully.', schema: { example: { message: 'OTP sent successfully', otp: '123456' } } })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid phone (user not found).' })
  @ApiResponse({ status: 500, description: 'Internal Server Error - Failed to generate OTP.' })
  async sendOTP(@Body() sendOtpDto: sendOtpDto): Promise<{ message: string; otp: string }> {
    return this.authService.sendOTP(sendOtpDto);
  }

  @Post('forget-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Initiate password reset process by sending OTP' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({ status: 200, description: 'OTP sent for password reset.', schema: { example: { message: 'OTP sent for password reset', otp: '123456' } } })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid phone (user not found).' })
  @ApiResponse({ status: 500, description: 'Internal Server Error - Failed to generate OTP.' })
  async forgetPassword(@Body() forgetPasswordDto: ForgotPasswordDto): Promise<{ message: string; otp: string }> {
    return this.authService.forgetPassword(forgetPasswordDto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset user password using OTP' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password successfully reset. Returns user details (excluding password).',
    schema: {
        example: {
            id: 'clxkjq5z70000abcdef1234',
            phone: '+998945895766',
            firstName: 'Kamron',
            lastName: 'Ibrohimov',
            userRole: 'Jismoniy',
            userStatus: 'ACTIVE',
            createdAt: '2023-10-27T10:00:00.000Z',
            updatedAt: '2023-10-27T12:34:56.789Z'
        }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid phone, OTP, or expired OTP.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error - Failed to reset password.' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<Omit<User, 'password'>> {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post('register-admin')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Yangi admin ro\'yxatdan o\'tkazish (faqat SUPERADMIN uchun)' })
  @ApiResponse({
    status: 201,
    description: 'Admin muvaffaqiyatli ro\'yxatdan o\'tdi',
    type: Object,
    example: { message: 'Admin muvaffaqiyatli ro\'yxatdan o\'tdi' },
  })
  @ApiResponse({ status: 400, description: 'Noto\'g\'ri ma\'lumotlar kiritildi yoki region topilmadi' })
  @ApiResponse({ status: 403, description: 'Ruxsat etilmagan foydalanuvchi' })
  @ApiResponse({ status: 409, description: 'Telefon raqami allaqachon mavjud' })
  @ApiResponse({ status: 500, description: 'Server xatosi' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async registerAdmin(@Body() dto: RegisterAdminDto) {
    return this.authService.registerAdmin(dto);
  }

  @Post('refresh-token')
  @HttpCode(200)
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refreshToken: { type: 'string', description: 'Refresh token to generate new access token' },
      },
      required: ['refreshToken'],
    },
  })
  @ApiResponse({ status: 200, description: 'Returns new access token.', schema: { example: { access: 'new-access-token' } } })
  @ApiResponse({ status: 400, description: 'Invalid or expired refresh token.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    if (!refreshToken) {
      throw new BadRequestException('Refresh token is required');
    }
    return this.authService.refreshToken(refreshToken);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard) 
  @ApiBearerAuth() 
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Returns user profile data.'})
  @ApiResponse({ status: 401, description: 'Unauthorized.'})
  getProfile(@Req() req) {
      return req.user;
  }
}