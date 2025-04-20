import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../config/prisma/prisma.service';
import { CreateMasterCategoryDto } from './dto/create-master-category.dto';
import { UpdateMasterCategoryDto } from './dto/update-master-category.dto';
import { MasterCategoryQueryDto } from './dto/master-category-query.dto';
import { Prisma, MasterCategory } from '@prisma/client';

@Injectable()
export class MasterCategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createDto: CreateMasterCategoryDto,
  ): Promise<MasterCategory> {

    try {
      const newCategory = await this.prisma.masterCategory.create({
        data: createDto,
      });
      return newCategory;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            `Kategoriya yaratilmadi: ${error.meta?.target} maydoni bo'yicha takrorlanish.`,
          );
        }
      }
      throw new InternalServerErrorException('Kategoriyani yaratishda kutilmagan xatolik yuz berdi.');
    }
  }

  async findAll(queryDto: MasterCategoryQueryDto): Promise<{
    data: MasterCategory[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'name_en',
      sortOrder = 'asc',
    } = queryDto;
    const skip = (page - 1) * limit;

    const where: Prisma.MasterCategoryWhereInput = {};
    if (search) {
      const searchCondition = { contains: search, mode: 'insensitive' as const };
      where.OR = [
        { name_uz: searchCondition },
        { name_en: searchCondition },
        { name_ru: searchCondition },
      ];
    }
  

    const orderBy: Prisma.MasterCategoryOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    try {
      const [categories, total] = await this.prisma.$transaction([
        this.prisma.masterCategory.findMany({
          where,
          skip,
          take: limit,
          orderBy,
        }),
        this.prisma.masterCategory.count({ where }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: categories,
        total,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      throw new InternalServerErrorException('Kategoriyalarni olishda xatolik yuz berdi.');
    }
  }

  async findOne(id: string): Promise<MasterCategory> {
    try {
      const category = await this.prisma.masterCategory.findUniqueOrThrow({
        where: { id },
      });
      return category;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`ID '${id}' ga ega master kategoriya topilmadi.`);
      }
      throw new InternalServerErrorException('Kategoriyani topishda kutilmagan xatolik.');
    }
  }

  async update(
    id: string,
    updateDto: UpdateMasterCategoryDto,
  ): Promise<MasterCategory> {
    await this.findOne(id);


    try {
      const updatedCategory = await this.prisma.masterCategory.update({
        where: { id },
        data: updateDto,
      });
      return updatedCategory;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            `Kategoriya yangilanmadi: ${error.meta?.target} maydoni bo'yicha takrorlanish.`,
          );
        }
        if (error.code === 'P2025') {
            throw new NotFoundException(`ID '${id}' ga ega kategoriya yangilash uchun topilmadi.`);
        }
      }
      throw new InternalServerErrorException('Kategoriyani yangilashda kutilmagan xatolik.');
    }
  }

  async remove(id: string): Promise<string> {
    await this.findOne(id);

    try {
      const deletedCategory = await this.prisma.masterCategory.delete({
        where: { id },
      });
      return "MasterCategory was deleted successfully!";
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003' || error.code === 'P2014') {
           throw new ConflictException(
                `ID '${id}' ga ega kategoriyani o'chirib bo'lmadi, chunki u boshqa yozuvlar bilan bog'langan (${error.meta?.field_name}).`,
            );
        }
         if (error.code === 'P2025') {
            throw new NotFoundException(`ID '${id}' ga ega kategoriya o'chirish uchun topilmadi.`);
        }
      }
      throw new InternalServerErrorException("Kategoriyani o'chirishda kutilmagan xatolik.");
    }
  }
}