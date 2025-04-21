import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../config/prisma/prisma.service'; 
import { CreateMasterServiceDto } from './dto/create-master-service.dto';
import { UpdateMasterServiceDto } from './dto/update-master-service.dto';
import { QueryMasterServiceDto } from './dto/query-master-service.dto';
import { MasterService, Prisma } from '@prisma/client'; 

@Injectable()
export class MasterServiceService {
  constructor(private readonly prisma: PrismaService) {}

  async validatePrices(
    masterCategoryId: string,
    priceHourly?: number,
    priceDaily?: number,
  ): Promise<void> {
    try {
      const masterCategory = await this.prisma.masterCategory.findUnique({
        where: { id: masterCategoryId },
      });

      if (!masterCategory) {
        throw new BadRequestException(
          `MasterCategory with ID ${masterCategoryId} not found.`,
        );
      }

      if (
        priceHourly !== undefined && 
        priceHourly > masterCategory.minWorkingHourlyPrice
      ) {
        throw new BadRequestException(
          `Hourly price (${priceHourly}) cannot be less than the minimum for this category (${masterCategory.minWorkingHourlyPrice}).`,
        );
      }

      if (
        priceDaily !== undefined &&
        priceDaily > masterCategory.minPriceDaily
      ) {
        throw new BadRequestException(
          `Daily price (${priceDaily}) cannot be less than the minimum for this category (${masterCategory.minPriceDaily}).`,
        );
      }
    } catch (error) {
        if (error instanceof BadRequestException) {
            throw error; 
        }
        console.error("Price validation error:", error);
        throw new InternalServerErrorException("Could not validate prices against category.");
    }
  }

  async create(
    createMasterServiceDto: CreateMasterServiceDto,
  ): Promise<MasterService> {
    const { masterCategoryId, masterId, priceHourly, priceDaily, ...restData } =
      createMasterServiceDto;

    await this.validatePrices(masterCategoryId, priceHourly, priceDaily);

    try {
      return await this.prisma.masterService.create({
        data: {
          ...restData,
          priceHourly,
          priceDaily,
          master: { connect: { id: masterId } },
          masterCategory: { connect: { id: masterCategoryId } },
        },
        include: {
          master: true,
          masterCategory: true, 
        },
      });
    } catch (error) {
        console.error("Error creating MasterService:", error)
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code == 'P2003') {
                 throw new BadRequestException(`Invalid masterId or masterCategoryId provided.`);
            }
            if (error.code == 'P2025') {
                 throw new BadRequestException(`Referenced Master or MasterCategory not found.`);
            }
        }
        if (error instanceof BadRequestException) throw error; 
        throw new InternalServerErrorException('Could not create master service.');
    }
  }

  async findAll(queryDto: QueryMasterServiceDto): Promise<{
    data: MasterService[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'id', 
      sortOrder = 'asc',
      search,
      masterId,
      masterCategoryId,
    } = queryDto;

    const skip = (page - 1) * limit;

    const where: Prisma.MasterServiceWhereInput = {};

    if (masterId) {
      where.masterId = masterId;
    }
    if (masterCategoryId) {
      where.masterCategoryId = masterCategoryId;
    }

    const orderBy: Prisma.MasterServiceOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    try {
      const [data, total] = await this.prisma.$transaction([
        this.prisma.masterService.findMany({
          where,
          skip,
          take: limit,
          orderBy,
          include: {
            master: { 
                 select: { id: true, fullName: true, phone: true, image: true, star: true}
            },
            masterCategory: {
                select: { id: true, name_en: true, name_ru: true, name_uz: true, icon: true}
            },
          },
        }),
        this.prisma.masterService.count({ where }),
      ]);

      return { data, total, page, limit };
    } catch (error) {
        console.error("Error fetching MasterServices:", error);
        throw new InternalServerErrorException('Could not retrieve master services.');
    }
  }

  async findOne(id: string): Promise<MasterService> {
    const masterService = await this.prisma.masterService.findUnique({
      where: { id },
      include: {
        master: true,
        masterCategory: true,
      },
    });

    if (!masterService) {
      throw new NotFoundException(`MasterService with ID ${id} not found`);
    }
    return masterService;
  }

  async update(
    id: string,
    updateMasterServiceDto: UpdateMasterServiceDto,
  ): Promise<MasterService> {
    const existingService = await this.findOne(id); 

    const { masterCategoryId, priceHourly, priceDaily, masterId, ...restData } =
      updateMasterServiceDto;

    const categoryIdToCheck = masterCategoryId ?? existingService.masterCategoryId;

    await this.validatePrices(
        categoryIdToCheck,
        priceHourly, 
        priceDaily  
    );

    const dataToUpdate: Prisma.MasterServiceUpdateInput = { ...restData };
    if (priceHourly !== undefined) dataToUpdate.priceHourly = priceHourly;
    if (priceDaily !== undefined) dataToUpdate.priceDaily = priceDaily;
    if (masterId) dataToUpdate.master = { connect: { id: masterId } };
    if (masterCategoryId) dataToUpdate.masterCategory = { connect: { id: masterCategoryId } };


    try {
      return await this.prisma.masterService.update({
        where: { id },
        data: dataToUpdate,
        include: {
          master: true,
          masterCategory: true,
        },
      });
    } catch (error) {
        console.error("Error updating MasterService:", error);
         if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code == 'P2025') {
                 throw new NotFoundException(`MasterService with ID ${id} or related entity not found for update.`);
            }
             if (error.code == 'P2003') {
                 throw new BadRequestException(`Invalid masterId or masterCategoryId provided for update.`);
            }
        }
        if (error instanceof BadRequestException) throw error; 
        if (error instanceof NotFoundException) throw error; 
        throw new InternalServerErrorException('Could not update master service.');
    }
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    try {
      await this.prisma.masterService.delete({
        where: { id },
      });
    } catch (error) {
        console.error("Error deleting MasterService:", error);
         if (error instanceof Prisma.PrismaClientKnownRequestError) {
             if (error.code == 'P2025') {
                 throw new NotFoundException(`MasterService with ID ${id} not found for deletion.`);
            }
         }
         if (error instanceof NotFoundException) throw error; // findOne dan
        throw new InternalServerErrorException('Could not delete master service.');
    }
  }
}