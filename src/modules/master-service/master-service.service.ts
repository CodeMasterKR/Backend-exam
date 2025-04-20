import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../config/prisma/prisma.service'; // PrismaService manzilingizni moslang
import { CreateMasterServiceDto } from './dto/create-master-service.dto';
import { UpdateMasterServiceDto } from './dto/update-master-service.dto';
import { QueryMasterServiceDto } from './dto/query-master-service.dto';
import { MasterService, Prisma } from '@prisma/client'; // Prisma turlarini import qilish

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
        priceHourly !== undefined && // Faqat priceHourly berilgan bo'lsa tekshiramiz
        priceHourly < masterCategory.minWorkingHourlyPrice
      ) {
        throw new BadRequestException(
          `Hourly price (${priceHourly}) cannot be less than the minimum for this category (${masterCategory.minWorkingHourlyPrice}).`,
        );
      }

      if (
        priceDaily !== undefined && // Faqat priceDaily berilgan bo'lsa tekshiramiz
        priceDaily < masterCategory.minPriceDaily
      ) {
        throw new BadRequestException(
          `Daily price (${priceDaily}) cannot be less than the minimum for this category (${masterCategory.minPriceDaily}).`,
        );
      }
    } catch (error) {
        if (error instanceof BadRequestException) {
            throw error; // Agar o'zimiz yuborgan BadRequest bo'lsa, qayta yuboramiz
        }
         // Agar masterCategory topilmasa yoki boshqa DB xatosi bo'lsa
        console.error("Price validation error:", error);
        throw new InternalServerErrorException("Could not validate prices against category.");
    }
  }

  async create(
    createMasterServiceDto: CreateMasterServiceDto,
  ): Promise<MasterService> {
    const { masterCategoryId, masterId, priceHourly, priceDaily, ...restData } =
      createMasterServiceDto;

    // Master va MasterCategory mavjudligini tekshirish (ixtiyoriy, FK constraint ham tekshiradi)
    // await this.prisma.master.findUniqueOrThrow({ where: { id: masterId }}); // Agar kerak bo'lsa
    // await this.prisma.masterCategory.findUniqueOrThrow({ where: { id: masterCategoryId } }); // Agar kerak bo'lsa

    // Narxlarni validatsiya qilish
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
          master: true, // Bog'liq master ma'lumotlarini qaytarish
          masterCategory: true, // Bog'liq kategoriya ma'lumotlarini qaytarish
        },
      });
    } catch (error) {
        console.error("Error creating MasterService:", error)
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // Masalan, P2002 (unique constraint) yoki P2003 (foreign key constraint)
            if (error.code === 'P2003') {
                 throw new BadRequestException(`Invalid masterId or masterCategoryId provided.`);
            }
            if (error.code === 'P2025') {
                // Bu holat connect ishlatilganda yuzaga kelishi mumkin
                 throw new BadRequestException(`Referenced Master or MasterCategory not found.`);
            }
        }
        if (error instanceof BadRequestException) throw error; // Narx validatsiyasidan kelgan xato
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
      sortBy = 'id', // Yoki 'createdAt' kabi default
      sortOrder = 'asc',
      search, // Search hozircha qo'llanilmaydi
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

    // TODO: Implement search logic if needed
    // if (search) {
    //   where.OR = [
    //     // Qidiruv maydonlarini qo'shing, masalan, agar description bo'lsa:
    //     // { description: { contains: search, mode: 'insensitive' } },
    //     // Yoki bog'liq modellardan qidirish (murakkabroq):
    //     // { master: { fullName: { contains: search, mode: 'insensitive' } } },
    //     // { masterCategory: { name_en: { contains: search, mode: 'insensitive' } } }
    //   ];
    // }

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
            master: { // Select qilib faqat kerakli fieldlarni olish mumkin
                 select: { id: true, fullName: true, phone: true, image: true, star: true}
            },
            masterCategory: { // Select qilib faqat kerakli fieldlarni olish mumkin
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
    // Avval mavjud yozuvni topamiz (va uning kategoriyasini bilish uchun)
    const existingService = await this.findOne(id); // Bu NotFoundException yuborishi mumkin

    const { masterCategoryId, priceHourly, priceDaily, masterId, ...restData } =
      updateMasterServiceDto;

     // Qaysi kategoriya ID sini ishlatishni aniqlash (yangi berilganmi yoki eskisi)
    const categoryIdToCheck = masterCategoryId ?? existingService.masterCategoryId;

    // Narxlarni yangi (yoki eski) kategoriya bo'yicha validatsiya qilish
    // Faqatgina DTO da narx berilgan bo'lsa validatsiya qilamiz
    await this.validatePrices(
        categoryIdToCheck,
        priceHourly, // Agar undefined bo'lsa, validatsiya o'tkazilmaydi
        priceDaily   // Agar undefined bo'lsa, validatsiya o'tkazilmaydi
    );

    // Ma'lumotlarni tayyorlash (agar masterId yoki masterCategoryId o'zgartirilsa, connect ishlatiladi)
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
            if (error.code === 'P2025') { // Record to update not found yoki connect qilinayotgan record topilmadi
                 throw new NotFoundException(`MasterService with ID ${id} or related entity not found for update.`);
            }
             if (error.code === 'P2003') {
                 throw new BadRequestException(`Invalid masterId or masterCategoryId provided for update.`);
            }
        }
        if (error instanceof BadRequestException) throw error; // Narx validatsiyasidan
        if (error instanceof NotFoundException) throw error; // findOne dan
        throw new InternalServerErrorException('Could not update master service.');
    }
  }

  async remove(id: string): Promise<void> {
    // Avval yozuv mavjudligini tekshirish
    await this.findOne(id); // Bu NotFoundException yuborishi mumkin

    try {
      await this.prisma.masterService.delete({
        where: { id },
      });
    } catch (error) {
        console.error("Error deleting MasterService:", error);
         if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // Masalan, P2025 (Record to delete not found) - garchi findOne tekshirsa ham
             if (error.code === 'P2025') {
                 throw new NotFoundException(`MasterService with ID ${id} not found for deletion.`);
            }
         }
         if (error instanceof NotFoundException) throw error; // findOne dan
        throw new InternalServerErrorException('Could not delete master service.');
    }
  }
}