import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../config/prisma/prisma.service'; 
import { CreateToolCategoryDto } from './dto/create-tool-category.dto';
import { UpdateToolCategoryDto } from './dto/update-tool-category.dto';
import { QueryToolCategoryDto } from './dto/query-tool-category.dto';
import { Prisma, ToolCategory } from '@prisma/client';

@Injectable()
export class ToolCategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateToolCategoryDto): Promise<ToolCategory> {
    try {
      return await this.prisma.toolCategory.create({
        data: createDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
      }
      console.error('Error creating ToolCategory:', error);
      throw new InternalServerErrorException('Could not create tool category.');
    }
  }

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

    if (search) {
      where.OR = [
        { name_uz: { contains: search, mode: 'insensitive' } },
        { name_en: { contains: search, mode: 'insensitive' } },
        { name_ru: { contains: search, mode: 'insensitive' } },
        { desc_uz: { contains: search, mode: 'insensitive' } }, 
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

  async findOne(id: string): Promise<ToolCategory> {
    const category = await this.prisma.toolCategory.findUnique({
      where: { id },
       include: {
           _count: { select: { tools: true } }, 
       }
    });

    if (!category) {
      throw new NotFoundException(`Tool category with ID ${id} not found.`);
    }
    return category;
  }

  async update(id: string, updateDto: UpdateToolCategoryDto): Promise<ToolCategory> {
    await this.findOne(id);

    try {
      return await this.prisma.toolCategory.update({
        where: { id },
        data: updateDto,
         include: { 
             _count: { select: { tools: true } },
         }
      });
    } catch (error) {
       console.error(`Error updating ToolCategory ${id}:`, error);
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code == 'P2025') {
           throw new NotFoundException(`Tool category with ID ${id} not found for update.`);
       }
      throw new InternalServerErrorException('Could not update tool category.');
    }
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    try {
      await this.prisma.toolCategory.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code == 'P2003') {
        throw new ConflictException(
          `Cannot delete category ${id}. It still has associated tools.`,
        );
      }
       console.error(`Error deleting ToolCategory ${id}:`, error);
      throw new InternalServerErrorException('Could not delete tool category.');
    }
  }
}