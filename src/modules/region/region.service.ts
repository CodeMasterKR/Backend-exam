import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma/prisma.service';
import { RegionFilterDto } from './dto/filter-region.dto';

@Injectable()
export class RegionService {
  constructor(private prisma: PrismaService) {}

  async create(name: string) {
    const isExist = await this.prisma.region.findFirst({
      where: {
        name
      },
    });
    if (isExist) {
      throw new BadRequestException('Region already exists with this name!');
    }

    let newRegion = await this.prisma.region.create({
      data: {name: name}
    })

    return newRegion;
  }

  async findAll(regionFilterDto: RegionFilterDto) {
    let { name, page, limit, order, sortBy } = regionFilterDto;

    page = page || 1;
    limit = limit || 10;
    const offset = (page - 1) * limit;

    const allowedSortFields = ['name', 'createdAt'];
    sortBy = allowedSortFields.includes(sortBy || '') ? sortBy : 'createdAt';

    const regions = await this.prisma.region.findMany({
      where: {
        name: name ? { contains: name, mode: 'insensitive' } : undefined,
      },
      orderBy: {
        [sortBy || 'createdAt']: order == 'desc' ? 'desc' : 'asc',
      },
      take: limit,
      skip: offset,
    });

    const total = await this.prisma.region.count({
      where: {
        name: name ? { contains: name, mode: 'insensitive' } : undefined,
      },
    });

    return { data: regions, total, page, limit };
  }

  async findOne(id: string) {
    const region = await this.prisma.region.findUnique({
      where: { id },
    });

    if (!region) {
      throw new BadRequestException('Region not found with this id!');
    }
    return region;
  }

  async update(id: string, name: string) {
    let region = await this.prisma.region.findUnique({
      where: { id },
    });

    if (!region) {
      throw new BadRequestException('Region not found with this id!');
    }

    const updated = await this.prisma.region.update({
      where: { id: id },
      data: { name },
    });

    return updated;
  }

  async remove(id: string) {
    const region = await this.prisma.region.findUnique({
      where: { id },
    });

    if (!region) {
      throw new BadRequestException('Region not found with this id!');
    }

    await this.prisma.region.delete({
      where: { id },
    });

    return 'Region was deleted successfully!';
  }
}