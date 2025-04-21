import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma/prisma.service'; 
import { CreateMasterDto } from './dto/create-master.dto';
import { UpdateMasterDto } from './dto/update-master.dto';
import { QueryMasterDto } from './dto/query-master.dto';
import { Master, Prisma } from '@prisma/client'; 

@Injectable()
export class MasterService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMasterDto: CreateMasterDto): Promise<Master> {
    try {
      return await this.prisma.master.create({
        data: {
          ...createMasterDto,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findAll(queryDto: QueryMasterDto) {
    const { page, limit, sortBy, sortOrder, search, isActive } = queryDto;
    const skip = (Number(page) - 1) * Number(limit);
    const take = limit;

    const where: Prisma.MasterWhereInput = {};

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } }, 
        { phone: { contains: search } },
        { about: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (isActive !== undefined) { 
        where.isActive = isActive;
    }


    const orderBy: Prisma.MasterOrderByWithRelationInput = {};
    if (sortBy && sortOrder) {
       if (sortBy == 'star') {
           orderBy[sortBy] = { sort: sortOrder, nulls: sortOrder == 'asc' ? 'first' : 'last' }; 
       } else {
           orderBy[sortBy] = sortOrder;
       }
    } else {
      orderBy.fullName = 'asc';
    }


    try {
      const masters = await this.prisma.master.findMany({
        where,
        skip,
        take,
        orderBy,
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
      throw error;
    }
  }

  async findOne(id: string): Promise<Master> {
    const master = await this.prisma.master.findUnique({
      where: { id },
    });

    if (!master) {
      throw new NotFoundException(`ID '${id}' boʻlgan Master topilmadi`);
    }
    return master;
  }

  async update(id: string, updateMasterDto: UpdateMasterDto): Promise<Master> {
    await this.findOne(id); 

    try {
      return await this.prisma.master.update({
        where: { id },
        data: {
          ...updateMasterDto,
        },
      });
    } catch (error) {
       if (error instanceof Prisma.PrismaClientKnownRequestError && error.code == 'P2025') {
           throw new NotFoundException(`ID '${id}' boʻlgan Master topilmadi`);
       }
      throw error;
    }
  }

  async remove(id: string): Promise<string> {
     await this.findOne(id); 

    try {
        await this.prisma.master.delete({
            where: { id },
        });
        return "Master was deleted successfully!"
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code == 'P2025') {
           throw new NotFoundException(`ID '${id}' boʻlgan Master topilmadi`);
        }
        throw error;
    }
  }
}