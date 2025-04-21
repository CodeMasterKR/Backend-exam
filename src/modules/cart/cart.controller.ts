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
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { FilterCartDto } from './dto/filter-cart.dto';
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
import { Cart } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@ApiTags('Carts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new cart' })
  @ApiBody({ type: CreateCartDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Cart successfully created.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  create(@Body() createCartDto: CreateCartDto): Promise<Cart> {
    return this.cartService.create(createCartDto);
  }

  @Get()
@ApiOperation({ summary: 'Get a carts of list' }) 
@ApiQuery({ type: FilterCartDto }) 
@ApiResponse({ status: HttpStatus.OK, description: 'successfully get' })  
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' }) 
async findAll(@Query() query: any): Promise<{ data: Cart[]; total: number; page: number; limit: number }> {
  const filterDto = plainToClass(FilterCartDto, query);
  const errors = await validate(filterDto);
  if (errors.length > 0) {
    throw new BadRequestException('Noto‘g‘ri query parametrlari'); 
  }
  return this.cartService.findAll(filterDto);
}

  @Get(':id')
  @ApiOperation({ summary: 'Get a cart by ID' })
  @ApiParam({ name: 'id', description: 'Cart ID (UUID)', type: String, format: 'uuid' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Cart details.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Cart not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Cart> {
    return this.cartService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a cart by ID' })
  @ApiParam({ name: 'id', description: 'Cart ID (UUID)', type: String, format: 'uuid' })
  @ApiBody({ type: UpdateCartDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Cart successfully updated.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Cart not found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCartDto: UpdateCartDto,
  ): Promise<Cart> {
    return this.cartService.update(id, updateCartDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a cart by ID' })
  @ApiParam({ name: 'id', description: 'Cart ID (UUID)', type: String, format: 'uuid' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Cart successfully deleted.', type: () => ({ id: String }) })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Cart not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<{ id: string }> {
    return this.cartService.remove(id);
  }
}