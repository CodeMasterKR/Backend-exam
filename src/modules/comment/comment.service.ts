import { Injectable, NotFoundException, Logger, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma/prisma.service'; 
import { CreateMultipleCommentsDto } from './dto/create-multiple-comments.dto.ts';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { FilterCommentDto } from './dto/filter-comment.dto';
import { Prisma, Comment } from '@prisma/client';

@Injectable()
export class CommentService {
  private readonly logger = new Logger(CommentService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createMultiple(createMultipleCommentsDto: CreateMultipleCommentsDto): Promise<Prisma.BatchPayload> {
    const { comments } = createMultipleCommentsDto;

    try {
      const result = await this.prisma.comment.createMany({
        data: comments, 
        skipDuplicates: false,
      });
      return result; 
    } catch (error) {
        this.logger.error(`Failed to create multiple comments: ${error.message}`, error.stack);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2003') {
                 throw new BadRequestException(`Foreign key constraint failed. Ensure all masterId and userId values exist.`);
            }
        }
        throw new InternalServerErrorException('Could not create comments.');
    }
  }

  async findAll(filterDto: FilterCommentDto): Promise<{ data: Comment[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', masterId, userId, minStars, maxStars } = filterDto;
    const skip = (page - 1) * limit;

    const where: Prisma.CommentWhereInput = {};
    if (masterId) where.masterId = masterId;
    if (userId) where.userId = userId;
    if (minStars !== undefined || maxStars !== undefined) {
        where.stars = {};
        if (minStars !== undefined) where.stars.gte = minStars;
        if (maxStars !== undefined) where.stars.lte = maxStars;
    }

    const orderBy: Prisma.CommentOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    const includeRelations = {
        user: { select: { id: true, firstName: true, lastName: true } }, 
        master: { select: { id: true, name: true } }, 
    };

     try {
        const [comments, total] = await this.prisma.$transaction([
            this.prisma.comment.findMany({
                where,
                skip,
                take: limit,
                orderBy,
                include: includeRelations,
            }),
            this.prisma.comment.count({ where }),
        ]);
        return { data: comments, total, page, limit };
    } catch (error) {
        this.logger.error(`Failed to fetch comments: ${error.message}`, error.stack);
        throw new InternalServerErrorException('Could not fetch comments.');
    }
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: {
        user: true,   
        master: true, 
      },
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    return comment;
  }

  async update(id: string, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    await this.findOne(id); 

    if (Object.keys(updateCommentDto).length === 0) {
         throw new BadRequestException('No fields provided for update.');
    }

    try {
        const updatedComment = await this.prisma.comment.update({
            where: { id },
            data: updateCommentDto, 
            include: {
                user: { select: { id: true, firstName: true, lastName: true } },
                master: { select: { id: true } }, 
            },
        });
        return updatedComment;
    } catch (error) {
        this.logger.error(`Failed to update comment ${id}: ${error.message}`, error.stack);
        throw new InternalServerErrorException('Could not update comment.');
    }
  }

  async remove(id: string): Promise<{ id: string }> {
    await this.findOne(id); 

    try {
        await this.prisma.comment.delete({
            where: { id },
        });
        return { id };
    } catch (error) {
        this.logger.error(`Failed to delete comment ${id}: ${error.message}`, error.stack);
        throw new InternalServerErrorException('Could not delete comment.');
    }
  }
}