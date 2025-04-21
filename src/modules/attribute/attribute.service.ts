import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma/prisma.service';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { QueryAttributeDto } from './dto/query-attribute.dto.ts';
import { Attribute, Prisma } from '@prisma/client';

@Injectable()
export class AttributeService {
  constructor(private prisma: PrismaService) {}

  async create(createAttributeDto: CreateAttributeDto): Promise<Attribute> {
    return this.prisma.attribute.create({
      data: createAttributeDto,
    });
  }

  async findAll(queryDto: QueryAttributeDto): Promise<{
    data: Attribute[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      limit = 10,
      filter,
      sortBy = 'name',
      sortOrder = 'asc',
    } = queryDto;
    const skip = (page - 1) * limit;

    const where: Prisma.AttributeWhereInput = filter
      ? { name: { contains: filter, mode: 'insensitive' } }
      : {};

    const orderBy: Prisma.AttributeOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.attribute.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
      this.prisma.attribute.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: string): Promise<Attribute> {
    const attribute = await this.prisma.attribute.findUnique({
      where: { id },
    });
    if (!attribute) {
      throw new NotFoundException(`Attribute with ID "${id}" not found`);
    }
    return attribute;
  }

  async update(
    id: string,
    updateAttributeDto: UpdateAttributeDto,
  ): Promise<Attribute> {
    try {
      return await this.prisma.attribute.update({
        where: { id },
        data: updateAttributeDto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code == 'P2025'
      ) {
        throw new NotFoundException(`Attribute with ID "${id}" not found`);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
     const attribute = await this.findOne(id);
     await this.prisma.attribute.delete({
       where: { id: attribute.id },
     });
  }
}