import { Injectable, NotFoundException, Logger, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma/prisma.service'; 
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { FilterOrderDto } from './dto/filter-order.dto';
import { Prisma, Order, User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf'; 

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);
  private readonly telegramBotToken: string;
  private readonly telegramChatId: string;
  private readonly bot: Telegraf; 

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {
    this.telegramBotToken = ('7948073917:AAGKsGRgAegybek2m5_XOG3K1hgkJT_k9eg');
    this.telegramChatId = ('-1002543425559');

    if (!this.telegramBotToken || !this.telegramChatId) {
        this.logger.warn('Telegram Bot Token or Chat ID is not configured. Notifications will be disabled.');
    } else {
        this.bot = new Telegraf(this.telegramBotToken);
    }
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { userId, cartId, ...orderData } = createOrderDto;

    await this.prisma.user.findUniqueOrThrow({ where: { id: userId } }).catch(() => {
        throw new NotFoundException(`User with ID ${userId} not found.`);
    });
    await this.prisma.cart.findUniqueOrThrow({ where: { id: cartId } }).catch(() => {
        throw new NotFoundException(`Cart with ID ${cartId} not found.`);
    });

    try {
        const createdOrder = await this.prisma.order.create({
            data: {
                ...orderData,
                userId,
                cartId,
            },
            include: {
                user: { select: { id: true, firstName: true, lastName: true, phone: true } },
                cart: true,
            },
        });

        this.sendTelegramNotification(createdOrder).catch(error => {
            this.logger.error(`Failed to send Telegram notification for order ${createdOrder.id}`, error);
        });

        return createdOrder;

    } catch (error) {
        this.logger.error(`Failed to create order: ${error.message}`, error.stack);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
        }
        throw new InternalServerErrorException('Could not create order.');
    }
  }

  async findAll(filterDto: FilterOrderDto): Promise<{ data: Order[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', userId, cartId, paymentStatus, status, withDelivery, isCompleted } = filterDto;
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {};
    if (userId) where.userId = userId;
    if (cartId) where.cartId = cartId;
    if (paymentStatus) where.paymentStatus = paymentStatus;
    if (status) where.status = { contains: status, mode: 'insensitive' };
    if (withDelivery !== undefined) where.withDelivery = withDelivery;

    const orderBy: Prisma.OrderOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    const includeRelations = {
        user: { select: { id: true, firstName: true, lastName: true } },
        cart: { select: { id: true, isCompleted: true } },
        _count: { select: { comments: true } },
    };

    try {
        const [orders, total] = await this.prisma.$transaction([
        this.prisma.order.findMany({
            where,
            skip,
            take: limit,
            orderBy,
            include: includeRelations,
        }),
        this.prisma.order.count({ where }),
        ]);
        return { data: orders, total, page, limit };
    } catch (error) {
        this.logger.error(`Failed to fetch orders: ${error.message}`, error.stack);
        throw new InternalServerErrorException('Could not fetch orders.');
    }
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        cart: {
            include: {
                toolItem: { include: { toolAttribute: true } },
                masterCategoryItem: { include: { level: true } }
            }
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    await this.findOne(id);
    const { userId, cartId, ...updateData } = updateOrderDto;
    if (userId || cartId) {
        this.logger.warn(`Attempted to update restricted fields (userId, cartId) for order ${id}`);
    }

    try {
        const updatedOrder = await this.prisma.order.update({
            where: { id },
            data: updateData,
            include: {
                user: { select: { id: true, firstName: true, lastName: true } },
                cart: true
            },
        });
        return updatedOrder;
    } catch (error) {
        this.logger.error(`Failed to update order ${id}: ${error.message}`, error.stack);
        throw new InternalServerErrorException('Could not update order.');
    }
  }

  async remove(id: string): Promise<{ id: string }> {
    await this.findOne(id);
    try {
        await this.prisma.order.delete({
            where: { id },
        });
        return { id };
    } catch (error) {
        this.logger.error(`Failed to delete order ${id}: ${error.message}`, error.stack);
        throw new InternalServerErrorException('Could not delete order.');
    }
  }

  private async sendTelegramNotification(order: Order & { user?: Partial<User & { firstName?: string; lastName?: string; phone?: string }> }): Promise<void> {
    if (!this.bot) {
        this.logger.warn(`Telegram bot is not initialized. Notification skipped for order ${order.id}.`);
        return;
    }

    const userName = order.user ? `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() || `ID: ${order.userId}` : `User ID: ${order.userId}`;
    const userPhone = order.user?.phone ? ` | Telefon: ${order.user.phone}` : '';

    const message = `
📦 *Yangi Buyurtma!* 📦

*ID:* \`${order.id}\`
*Mijoz:* ${userName}${userPhone}
*Manzil:* ${order.address || 'Noma\'lum'} (${order.location || 'Noma\'lum'})
*Yetkazish:* ${order.withDelivery ? '✅ Bor' : '❌ Yo\'q'}
*Status:* ${order.status || 'Noma\'lum'}
*Izoh:* ${order.commentToDelivery || '-'}
*Vaqt:* ${new Date(order.createdAt).toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })}
    `.trim().replace(/ +/g, ' '); 

    try {
        await this.bot.telegram.sendMessage(this.telegramChatId, message, {
            parse_mode: 'Markdown', 
        });
        this.logger.log(`Telegram notification sent successfully for order ${order.id}`);
    } catch (error) {
        this.logger.error(`Failed to send Telegram notification via Telegraf for order ${order.id}: ${error.message}`, error.stack);
    }
  }
}