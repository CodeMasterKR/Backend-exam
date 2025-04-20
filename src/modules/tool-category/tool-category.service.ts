import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ConflictException, // O'chirishdagi xatolik uchun
} from '@nestjs/common';
import { PrismaService } from '../../config/prisma/prisma.service'; // Manzilni to'g'rilang
import { CreateToolCategoryDto } from './dto/create-tool-category.dto';
import { UpdateToolCategoryDto } from './dto/update-tool-category.dto';
import { QueryToolCategoryDto } from './dto/query-tool-category.dto';
import { Prisma, ToolCategory } from '@prisma/client';

@Injectable()
export class ToolCategoryService {
  constructor(private readonly prisma: PrismaService) {}

  // Yangi kategoriya yaratish
  async create(createDto: CreateToolCategoryDto): Promise<ToolCategory> {
    try {
      return await this.prisma.toolCategory.create({
        data: createDto,
      });
    } catch (error) {
      // Duplikat yoki boshqa ma'lum xatoliklar
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
           // Masalan, P2002 - unique constraint violation (agar nomlar unique bo'lishi kerak bo'lsa)
           // Bu yerda aniq xatolik kodini tekshirishingiz mumkin
      }
      console.error('Error creating ToolCategory:', error);
      throw new InternalServerErrorException('Could not create tool category.');
    }
  }

  // Barcha kategoriyalarni olish
  async findAll(queryDto: QueryToolCategoryDto): Promise<{
    data: ToolCategory[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'name_en',
      sortOrder = 'asc',
      search,
    } = queryDto;

    const skip = (page - 1) * limit;
    const where: Prisma.ToolCategoryWhereInput = {};

    // Qidiruv
    if (search) {
      where.OR = [
        { name_uz: { contains: search, mode: 'insensitive' } },
        { name_en: { contains: search, mode: 'insensitive' } },
        { name_ru: { contains: search, mode: 'insensitive' } },
        { desc_uz: { contains: search, mode: 'insensitive' } }, // Tavsif bo'yicha ham qidirish
        { desc_en: { contains: search, mode: 'insensitive' } },
        { desc_ru: { contains: search, mode: 'insensitive' } },
      ];
    }

    try {
      const [data, total] = await this.prisma.$transaction([
        this.prisma.toolCategory.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: {
            // Bog'liq asboblar sonini qo'shamiz
            _count: { select: { tools: true } },
          },
        }),
        this.prisma.toolCategory.count({ where }),
      ]);
      return { data, total, page, limit };
    } catch (error) {
      console.error('Error fetching ToolCategories:', error);
      throw new InternalServerErrorException('Could not retrieve tool categories.');
    }
  }

  // Bitta kategoriyani ID bo'yicha olish
  async findOne(id: string): Promise<ToolCategory> {
    const category = await this.prisma.toolCategory.findUnique({
      where: { id },
       include: {
           _count: { select: { tools: true } }, // Bog'liq asboblar soni
       }
    });

    if (!category) {
      throw new NotFoundException(`Tool category with ID ${id} not found.`);
    }
    return category;
  }

  // Kategoriyani yangilash
  async update(id: string, updateDto: UpdateToolCategoryDto): Promise<ToolCategory> {
    // Mavjudligini tekshirish
    await this.findOne(id);

    try {
      return await this.prisma.toolCategory.update({
        where: { id },
        data: updateDto,
         include: { // Yangilangan ma'lumotni qaytarish uchun
             _count: { select: { tools: true } },
         }
      });
    } catch (error) {
       console.error(`Error updating ToolCategory ${id}:`, error);
       // Agar P2025 (Record to update not found) xatosi bo'lsa (garchi findOne tekshirsa ham)
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
           throw new NotFoundException(`Tool category with ID ${id} not found for update.`);
       }
      throw new InternalServerErrorException('Could not update tool category.');
    }
  }

  // Kategoriyani o'chirish
  async remove(id: string): Promise<void> {
    // Mavjudligini tekshirish
    await this.findOne(id);

    try {
      await this.prisma.toolCategory.delete({ where: { id } });
    } catch (error) {
      // Agar P2003 (Foreign key constraint) xatosi bo'lsa, ya'ni unga bog'liq 'Tool'lar mavjud bo'lsa
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
        throw new ConflictException(
          `Cannot delete category ${id}. It still has associated tools.`,
        );
      }
       console.error(`Error deleting ToolCategory ${id}:`, error);
      throw new InternalServerErrorException('Could not delete tool category.');
    }
  }
}