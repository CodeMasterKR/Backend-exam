import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { FilterOrderDto } from './dto/filter-order.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard'; 
import { Order } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Yangi buyurtma yaratish' }) 
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Buyurtma muvaffaqiyatli yaratildi.' }) 
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Noto‘g‘ri kirish ma’lumotlari.' }) 
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Foydalanuvchi yoki savat topilmadi.' }) 
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Ruxsat berilmagan.' }) 
  create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Buyurtmalar ro‘yxatini olish' }) 
  @ApiQuery({ type: FilterOrderDto }) 
  @ApiResponse({ status: HttpStatus.OK, description: 'Buyurtmalar ro‘yxati muvaffaqiyatli olingan.' }) 
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Ruxsat berilmagan.' }) 
  async findAll(@Query() query: any): Promise<{ data: Order[]; total: number; page: number; limit: number }> {
    const filterDto = plainToClass(FilterOrderDto, query);

    const errors = await validate(filterDto);
    if (errors.length > 0) {
      throw new BadRequestException('Noto‘g‘ri query parametrlari'); 
    }

    return this.orderService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buyurtmani ID bo‘yicha olish' }) 
  @ApiParam({ name: 'id', description: 'Buyurtma ID (UUID)', type: String, format: 'uuid' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Buyurtma tafsilotlari.' }) 
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Buyurtma topilmadi.' }) 
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Ruxsat berilmagan.' }) 
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Order> {
    return this.orderService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Buyurtmani ID bo‘yicha yangilash' }) 
  @ApiParam({ name: 'id', description: 'Buyurtma ID (UUID)', type: String, format: 'uuid' })
  @ApiBody({ type: UpdateOrderDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Buyurtma muvaffaqiyatli yangilandi.' }) 
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Buyurtma topilmadi.' }) 
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Noto‘g‘ri kirish ma’lumotlari.' }) 
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Ruxsat berilmagan.' }) 
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Buyurtmani ID bo‘yicha o‘chirish' }) 
  @ApiParam({ name: 'id', description: 'Buyurtma ID (UUID)', type: String, format: 'uuid' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Buyurtma muvaffaqiyatli o‘chirildi.', type: () => ({ id: String }) }) 
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Buyurtma topilmadi.' }) 
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Ruxsat berilmagan.' }) 
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<{ id: string }> {
    return this.orderService.remove(id);
  }
}