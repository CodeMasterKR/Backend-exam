import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateMultipleCommentsDto } from './dto/create-multiple-comments.dto.ts';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { FilterCommentDto } from './dto/filter-comment.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard'; 
import { Comment, Prisma } from '@prisma/client'; 

@ApiTags('Comments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @ApiOperation({ summary: 'Create one or more comments' })
  @ApiBody({ type: CreateMultipleCommentsDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Comments successfully created.', type: () => ({ count: Number }) }) // Type hint for BatchPayload
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data or foreign key violation.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  createMultiple(@Body() createMultipleCommentsDto: CreateMultipleCommentsDto): Promise<Prisma.BatchPayload> {
    return this.commentService.createMultiple(createMultipleCommentsDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get a list of comments' })
  @ApiQuery({ type: FilterCommentDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of comments retrieved.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  findAll(@Query() filterDto: FilterCommentDto): Promise<{ data: Comment[]; total: number; page: number; limit: number }> {
    return this.commentService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a comment by ID' })
  @ApiParam({ name: 'id', description: 'Comment ID (UUID)', type: String, format: 'uuid' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Comment details.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Comment not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Comment> {
    return this.commentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a comment by ID (e.g., update stars)' })
  @ApiParam({ name: 'id', description: 'Comment ID (UUID)', type: String, format: 'uuid' })
  @ApiBody({ type: UpdateCommentDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Comment successfully updated.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Comment not found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    return this.commentService.update(id, updateCommentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a comment by ID' })
  @ApiParam({ name: 'id', description: 'Comment ID (UUID)', type: String, format: 'uuid' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Comment successfully deleted.', type: () => ({ id: String }) })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Comment not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<{ id: string }> {
    return this.commentService.remove(id);
  }
}