import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../config/prisma/prisma.service';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { QueryToolDto } from './dto/query-tool.dto';
import { Prisma, Tool } from '@prisma/client';

@Injectable()
export class ToolService {
  constructor(private readonly prisma: PrismaService) {}

  private async validateCategory(id: string): Promise<void> {
    try {
      const category = await this.prisma.toolCategory.findUnique({ where: { id } });
      if (!category) {
        throw new BadRequestException(`ToolCategory with ID ${id} not found.`);
      }
    } catch (error) {
        if (error instanceof BadRequestException) throw error;
        console.error("Error validating ToolCategory:", error);
        throw new InternalServerErrorException('Could not verify tool category.');
    }
  }

  async create(createDto: CreateToolDto): Promise<Tool> {
    const { toolSubCategoryId, ...toolData } = createDto; // Changed variable name
    await this.validateCategory(toolSubCategoryId);

    try {
      return await this.prisma.tool.create({
        data: {
          ...toolData,
          toolSubCategory: { // Changed relation name
            connect: { id: toolSubCategoryId },
          },
        },
        include: { toolSubCategory: true } // Changed relation name
      });
    } catch (error) {
       if (error instanceof Prisma.PrismaClientKnownRequestError && (error.code === 'P2025' || error.code === 'P2003')) {
          throw new BadRequestException(`Invalid toolSubCategoryId: ${toolSubCategoryId}.`); // Changed field name
       }
       console.error('Error creating Tool:', error);
      throw new InternalServerErrorException('Could not create tool.');
    }
  }

  async findAll(queryDto: QueryToolDto): Promise<{
    data: Tool[];
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
      toolSubCategoryId, // Changed variable name
      isActive,
      brand,
    } = queryDto;

    const skip = (page - 1) * limit;
    const where: Prisma.ToolWhereInput = {};

    if (toolSubCategoryId) { // Changed field name
      where.toolSubCategoryId = toolSubCategoryId; // Changed field name
    }
    if (isActive !== undefined) {
      where.isActive = isActive;
    }
     if (brand) {
      where.brand = { contains: brand, mode: 'insensitive'};
    }

    if (search) {
      where.OR = [
        { name_uz: { contains: search, mode: 'insensitive' } },
        { name_en: { contains: search, mode: 'insensitive' } },
        { name_ru: { contains: search, mode: 'insensitive' } },
        { desc_uz: { contains: search, mode: 'insensitive' } },
        { desc_en: { contains: search, mode: 'insensitive' } },
        { desc_ru: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
      ];
    }

    try {
      const [data, total] = await this.prisma.$transaction([
        this.prisma.tool.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: {
            toolSubCategory: { select: { id: true, name_en: true } }, // Changed relation name
            _count: { select: { cartItems: true, attributes: true } }
          },
        }),
        this.prisma.tool.count({ where }),
      ]);
      return { data, total, page, limit };
    } catch (error) {
      console.error('Error fetching Tools:', error);
      throw new InternalServerErrorException('Could not retrieve tools.');
    }
  }

  async findOne(id: string): Promise<Tool> {
    const tool = await this.prisma.tool.findUnique({
      where: { id },
      include: {
          toolSubCategory: true, // Changed relation name
          attributes: true, // Include attributes in detail view if needed
          _count: { select: { cartItems: true } }
      }
    });

    if (!tool) {
      throw new NotFoundException(`Tool with ID ${id} not found.`);
    }
    return tool;
  }

  async update(id: string, updateDto: UpdateToolDto): Promise<Tool> {
    const { toolSubCategoryId, ...toolData } = updateDto; // Changed variable name
    await this.findOne(id);

    if (toolSubCategoryId) { // Changed variable name
      await this.validateCategory(toolSubCategoryId); // Changed variable name
    }

    try {
      return await this.prisma.tool.update({
        where: { id },
        data: {
          ...toolData,
          toolSubCategory: toolSubCategoryId // Changed relation name
            ? { connect: { id: toolSubCategoryId } } // Changed field name
            : undefined,
        },
         include: { toolSubCategory: true } // Changed relation name
      });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && (error.code === 'P2025' || error.code === 'P2003')) {
           throw new BadRequestException(`Invalid toolSubCategoryId: ${toolSubCategoryId} for update.`); // Changed field name
       }
       console.error(`Error updating Tool ${id}:`, error);
      throw new InternalServerErrorException('Could not update tool.');
    }
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    try {
      await this.prisma.tool.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
        throw new ConflictException(
          `Cannot delete tool ${id}. It is referenced by other records (e.g., Cart Items).`,
        );
      }
       console.error(`Error deleting Tool ${id}:`, error);
      throw new InternalServerErrorException('Could not delete tool.');
    }
  }
}