import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma/prisma.service'; 
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { FilterCartDto } from './dto/filter-cart.dto';
import { Prisma, Cart } from '@prisma/client';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCartDto: CreateCartDto): Promise<Cart> {
    const { userId, isCompleted, toolItems = [], masterCategoryItems = [] } = createCartDto;

    const createdCart = await this.prisma.cart.create({
      data: {
        userId,
        isCompleted,
        toolItem: {
          createMany: {
            data: toolItems.map(item => ({
              toolAttributeId: item.toolAttributeId,
              count: item.count,
            })),
          },
        },
        masterCategoryItem: {
          createMany: {
            data: masterCategoryItems.map(item => ({
              levelId: item.levelId,
              count: item.count,
            })),
          },
        },
      },
      include: {
        user: { select: { id: true }}, 
        toolItem: { include: { toolAttribute: { select: { id: true }} }}, 
        masterCategoryItem: { include: { level: { select: { id: true }} }}, 
        orders: false,
      },
    });

    return createdCart;
  }

  async findAll(filterDto: FilterCartDto): Promise<{ data: Cart[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', userId, isCompleted } = filterDto;
    const skip = (page - 1) * limit;

    const where: Prisma.CartWhereInput = {};
    if (userId) where.userId = userId;
    if (isCompleted !== undefined) where.isCompleted = isCompleted;

    const orderBy: Prisma.CartOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    const includeRelations = {
      user: { select: { id: true }},
      toolItem: { include: { toolAttribute: { select: { id: true }} } },
      masterCategoryItem: { include: { level: { select: { id: true }} } },
      _count: true, 
    };

    const [carts, total] = await this.prisma.$transaction([
      this.prisma.cart.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: includeRelations,
      }),
      this.prisma.cart.count({ where }),
    ]);

    return { data: carts, total, page, limit };
  }

  async findOne(id: string): Promise<Cart> {
    const cart = await this.prisma.cart.findUnique({
      where: { id },
      include: {
        user: { select: { id: true } }, 
        toolItem: {
           include: { toolAttribute: true }
        },
        masterCategoryItem: {
           include: { level: true }
        },
        orders: { 
          select: {
            id: true,
            status: true,
            createdAt: true,
          }
        }
      },
    });

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }
    return cart;
  }

  async update(id: string, updateCartDto: UpdateCartDto): Promise<Cart> {
    const existingCart = await this.prisma.cart.findUnique({ where: { id }});
    if (!existingCart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }
    const { toolItems, masterCategoryItems, ...cartData } = updateCartDto;

    const updatedCart = await this.prisma.cart.update({
      where: { id },
      data: cartData, 
      include: { 
        user: { select: { id: true }},
        toolItem: { include: { toolAttribute: true } },
        masterCategoryItem: { include: { level: true } },
      },
    });
    return updatedCart;
  }

  async remove(id: string): Promise<{ id: string }> {
    const existingCart = await this.prisma.cart.findUnique({ where: { id }});
    if (!existingCart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }
    await this.prisma.cart.delete({
      where: { id },
    });
    return { id };
  }
}