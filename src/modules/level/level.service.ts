import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../config/prisma/prisma.service'; 
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { QueryLevelDto } from './dto/query-level.dto';
import { Level, Prisma } from '@prisma/client';

@Injectable()
export class LevelService {
  constructor(private readonly prisma: PrismaService) {}

  async checkMasterCategoryExists(id: string): Promise<void> {
      try {
          const category = await this.prisma.masterCategory.findUnique({
              where: { id },
              select: { id: true }
          });
          if (!category) {
               throw new BadRequestException(`MasterCategory with ID ${id} not found.`);
          }
      } catch (error) {
           if (error instanceof BadRequestException) throw error;
           console.error("Error checking MasterCategory existence:", error);
           throw new InternalServerErrorException(`Could not verify MasterCategory with ID ${id}.`);
      }
  }

  async create(createLevelDto: CreateLevelDto): Promise<Level> {
    const { masterCategoryId, ...levelData } = createLevelDto;

    await this.checkMasterCategoryExists(masterCategoryId);

    try {
      return await this.prisma.level.create({
        data: {
          ...levelData,
          masterCategory: {
            connect: { id: masterCategoryId },
          },
        },
        include: {
          masterCategory: { 
            select: { id: true, name_en: true, name_uz: true, name_ru: true } 
          }
        },
      });
    } catch (error) {
      console.error('Error creating Level:', error);
       if (error instanceof Prisma.PrismaClientKnownRequestError) {
           if (error.code == 'P2003') {
                throw new BadRequestException(`Invalid masterCategoryId provided: ${masterCategoryId}.`);
           }
           if (error.code == 'P2025') {
               throw new BadRequestException(`MasterCategory with ID ${masterCategoryId} not found.`);
           }
       }
       if (error instanceof BadRequestException) throw error; 
      throw new InternalServerErrorException('Could not create level.');
    }
  }

  async findAll(queryDto: QueryLevelDto): Promise<{
    data: Level[];
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
      masterCategoryId,
    } = queryDto;

    const skip = (page - 1) * limit;

    const where: Prisma.LevelWhereInput = {};

    if (masterCategoryId) {
      where.masterCategoryId = masterCategoryId;
    }

    if (search) {
      where.OR = [
        { name_uz: { contains: search, mode: 'insensitive' } },
        { name_en: { contains: search, mode: 'insensitive' } },
        { name_ru: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy: Prisma.LevelOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    try {
      const [data, total] = await this.prisma.$transaction([
        this.prisma.level.findMany({
          where,
          skip,
          take: limit,
          orderBy,
          include: {
             masterCategory: {
                select: { id: true, name_en: true, name_uz: true, name_ru: true }
             }
          },
        }),
        this.prisma.level.count({ where }),
      ]);

      return { data, total, page, limit };
    } catch (error) {
      console.error('Error fetching Levels:', error);
      throw new InternalServerErrorException('Could not retrieve levels.');
    }
  }

  async findOne(id: string): Promise<Level> {
    try {
        const level = await this.prisma.level.findUniqueOrThrow({
          where: { id },
           include: {
               masterCategory: {
                   select: { id: true, name_en: true, name_uz: true, name_ru: true }
               }
           },
        });
         return level;
    } catch (error) {
         if (error instanceof Prisma.PrismaClientKnownRequestError && error.code == 'P2025') {
             throw new NotFoundException(`Level with ID ${id} not found.`);
         }
         console.error(`Error fetching level with ID ${id}:`, error);
        throw new InternalServerErrorException('Could not retrieve level.');
    }
  }

  async update(id: string, updateLevelDto: UpdateLevelDto): Promise<Level> {
    await this.findOne(id); 

    const { masterCategoryId, ...levelData } = updateLevelDto;

    if (masterCategoryId) {
        await this.checkMasterCategoryExists(masterCategoryId);
    }

    const dataToUpdate: Prisma.LevelUpdateInput = { ...levelData };
    if (masterCategoryId) {
      dataToUpdate.masterCategory = { connect: { id: masterCategoryId } };
    }

    try {
      return await this.prisma.level.update({
        where: { id },
        data: dataToUpdate,
        include: {
           masterCategory: {
                select: { id: true, name_en: true, name_uz: true, name_ru: true }
            }
        },
      });
    } catch (error) {
      console.error(`Error updating level with ID ${id}:`, error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
             if (error.code == 'P2025') {
                 throw new NotFoundException(`Level with ID ${id} or related MasterCategory not found for update.`);
            }
             if (error.code == 'P2003') {
                 throw new BadRequestException(`Invalid masterCategoryId provided for update: ${masterCategoryId}.`);
            }
        }
        if (error instanceof BadRequestException) throw error;
        if (error instanceof NotFoundException) throw error; 
      throw new InternalServerErrorException('Could not update level.');
    }
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id); 

    try {
      await this.prisma.level.delete({
        where: { id },
      });
    } catch (error) {
      console.error(`Error deleting level with ID ${id}:`, error);
       if (error instanceof Prisma.PrismaClientKnownRequestError && error.code == 'P2025') {
            throw new NotFoundException(`Level with ID ${id} not found for deletion.`);
       }
       if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Could not delete level.');
    }
  }
}