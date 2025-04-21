import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma/prisma.service';
import { CreateToolAttributeDto } from './dto/create-tool-attribute.dto';
import { UpdateToolAttributeDto } from './dto/update-tool-attribute.dto';
import { QueryToolAttributeDto } from './dto/query-tool-attribute.dto';
import { Prisma, toolAttribute } from '@prisma/client';

@Injectable()
export class ToolAttributeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createToolAttributeDto: CreateToolAttributeDto): Promise<toolAttribute> {
    try {
        await this.prisma.tool.findUniqueOrThrow({ where: { id: createToolAttributeDto.toolId } });
        await this.prisma.attribute.findUniqueOrThrow({ where: { id: createToolAttributeDto.attributeId } });

        return this.prisma.toolAttribute.create({
            data: createToolAttributeDto,
        });
    } catch (error) {
       if (error instanceof Prisma.PrismaClientKnownRequestError) {
         if (error.code === 'P2003') { 
            throw new NotFoundException(`Tool or Attribute with provided ID not found.`);
         }
         if (error.code === 'P2025') { 
            throw new NotFoundException(`Related Tool or Attribute not found.`);
         }
       }
       throw error;
    }
  }

  async findAll(queryDto: QueryToolAttributeDto) {
    const { page = 1, limit = 10, toolId, attributeId, value, sortBy, order = 'asc' } = queryDto;
    const skip = (page - 1) * limit;

    const where: Prisma.toolAttributeWhereInput = {};
    if (toolId) {
      where.toolId = toolId;
    }
    if (attributeId) {
      where.attributeId = attributeId;
    }
    if (value) {
      where.value = { contains: value, mode: 'insensitive' }; 
    }

    const orderBy: Prisma.toolAttributeOrderByWithRelationInput = {};
    const allowedSortByFields = ['value', 'toolId', 'attributeId']; 
    if (sortBy && allowedSortByFields.includes(sortBy) && order) {
      orderBy[sortBy] = order;
    } else {
        orderBy.id = 'asc'; 
    }


    const [data, total] = await this.prisma.$transaction([
      this.prisma.toolAttribute.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
            tool: { select: { id: true, name_en: true }}, 
            attribute: { select: { id: true, name: true }}, 
        },
      }),
      this.prisma.toolAttribute.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  async findOne(id: string): Promise<toolAttribute | null> {
    const toolAttr = await this.prisma.toolAttribute.findUnique({
      where: { id },
       include: {
            tool: { select: { id: true, name_en: true }},
            attribute: { select: { id: true, name: true }},
       },
    });
    if (!toolAttr) {
      throw new NotFoundException(`ToolAttribute with ID "${id}" not found`);
    }
    return toolAttr;
  }

  async update(id: string, updateToolAttributeDto: UpdateToolAttributeDto): Promise<toolAttribute> {
     if (updateToolAttributeDto.toolId) {
        await this.prisma.tool.findUniqueOrThrow({ where: { id: updateToolAttributeDto.toolId } }).catch(() => {
           throw new NotFoundException(`Tool with ID "${updateToolAttributeDto.toolId}" not found.`);
        });
     }
     if (updateToolAttributeDto.attributeId) {
        await this.prisma.attribute.findUniqueOrThrow({ where: { id: updateToolAttributeDto.attributeId } }).catch(() => {
             throw new NotFoundException(`Attribute with ID "${updateToolAttributeDto.attributeId}" not found.`);
        });
     }

    try {
      return await this.prisma.toolAttribute.update({
        where: { id },
        data: updateToolAttributeDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`ToolAttribute with ID "${id}" not found`);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<toolAttribute> {
    try {
      return await this.prisma.toolAttribute.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`ToolAttribute with ID "${id}" not found`);
      }
      throw error;
    }
  }
}