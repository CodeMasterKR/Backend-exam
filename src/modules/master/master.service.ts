import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma/prisma.service'; // PrismaService joylashuviga moslang
import { CreateMasterDto } from './dto/create-master.dto';
import { UpdateMasterDto } from './dto/update-master.dto';
import { QueryMasterDto } from './dto/query-master.dto';
import { Master, Prisma } from '@prisma/client'; // Prisma modelini import qilish

@Injectable()
export class MasterService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMasterDto: CreateMasterDto): Promise<Master> {
    try {
      return await this.prisma.master.create({
        data: {
          ...createMasterDto,
          // isActive DTOda ixtiyoriy, lekin modelda shart emas, default bor
          // dateBirth stringdan Date ga o'tkaziladi (agar class-transformer ishlatilmasa)
          // dateBirth: new Date(createMasterDto.dateBirth), // Agar DTOda string bo'lsa
        },
      });
    } catch (error) {
      // Xatoliklarni qayta ishlash (masalan, unique constraint)
      // Loggerdan foydalanish mumkin
      throw error; // Yoki o'zgartirilgan xatolik
    }
  }

  async findAll(queryDto: QueryMasterDto) {
    const { page, limit, sortBy, sortOrder, search, isActive } = queryDto;
    const skip = (Number(page) - 1) * Number(limit);
    const take = limit;

    const where: Prisma.MasterWhereInput = {};

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } }, // Case-insensitive qidiruv
        { phone: { contains: search } },
        { about: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (isActive !== undefined) { // null yoki undefined emasligini tekshirish
        where.isActive = isActive;
    }


    const orderBy: Prisma.MasterOrderByWithRelationInput = {};
    if (sortBy && sortOrder) {
       // star ixtiyoriy bo'lgani uchun alohida tekshirish
       if (sortBy === 'star') {
           orderBy[sortBy] = { sort: sortOrder, nulls: sortOrder === 'asc' ? 'first' : 'last' }; // null qiymatlarni boshiga yoki oxiriga qo'yish
       } else {
           orderBy[sortBy] = sortOrder;
       }
    } else {
      // Default saralash
      orderBy.fullName = 'asc';
    }


    try {
      const masters = await this.prisma.master.findMany({
        where,
        skip,
        take,
        orderBy,
        // include: { MasterService: true } // Agar bog'liq ma'lumotlar kerak bo'lsa
      });

      const totalMasters = await this.prisma.master.count({ where });
      const totalPages = Math.ceil(totalMasters / Number(limit));

      return {
        data: masters,
        meta: {
          totalItems: totalMasters,
          itemCount: masters.length,
          itemsPerPage: limit,
          totalPages: totalPages,
          currentPage: page,
        },
      };
    } catch (error) {
      // Loggerdan foydalanish mumkin
      throw error;
    }
  }

  async findOne(id: string): Promise<Master> {
    const master = await this.prisma.master.findUnique({
      where: { id },
      // include: { MasterService: true } // Agar bog'liq ma'lumotlar kerak bo'lsa
    });

    if (!master) {
      throw new NotFoundException(`ID '${id}' boʻlgan Master topilmadi`);
    }
    return master;
  }

  async update(id: string, updateMasterDto: UpdateMasterDto): Promise<Master> {
    // Avval master mavjudligini tekshiramiz
    await this.findOne(id); // Agar topilmasa, NotFoundException tashlaydi

    try {
      return await this.prisma.master.update({
        where: { id },
        data: {
          ...updateMasterDto,
          // dateBirth ni yangilashda stringdan Date ga o'tkazish kerak bo'lishi mumkin
          // dateBirth: updateMasterDto.dateBirth ? new Date(updateMasterDto.dateBirth) : undefined,
        },
      });
    } catch (error) {
        // Masalan, P2025 xatoligi (update qilinayotgan yozuv topilmasa)
       if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
           throw new NotFoundException(`ID '${id}' boʻlgan Master topilmadi`);
       }
      throw error;
    }
  }

  async remove(id: string): Promise<string> {
     // Avval master mavjudligini tekshiramiz
     await this.findOne(id); // Agar topilmasa, NotFoundException tashlaydi

    try {
        await this.prisma.master.delete({
            where: { id },
        });
        return "Master was deleted successfully!"
    } catch (error) {
         // Masalan, P2025 xatoligi (o'chirilayotgan yozuv topilmasa)
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
           throw new NotFoundException(`ID '${id}' boʻlgan Master topilmadi`);
        }
        throw error;
    }
  }
}