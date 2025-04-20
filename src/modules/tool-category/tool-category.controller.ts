import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ToolCategoryService } from './tool-category.service';
import { CreateToolCategoryDto } from './dto/create-tool-category.dto';
import { UpdateToolCategoryDto } from './dto/update-tool-category.dto';
import { QueryToolCategoryDto } from './dto/query-tool-category.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
  ApiOkResponse,
  ApiProperty,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard'; // Manzilni to'g'rilang
import { ToolCategory } from '@prisma/client';

// Swagger uchun javob sxemasi (ixtiyoriy, lekin tavsiya etiladi)
class ToolCategoryResponse extends CreateToolCategoryDto {
    @ApiProperty({ example: 'c1b2a3d4-e5f6-7890-1234-567890abcdef' })
    id: string;

    @ApiProperty({ description: 'Bog\'liq asboblar soni', example: { tools: 5 }})
    _count?: { tools: number };
}

@ApiTags('Tool Categories') // Guruh nomini o'zgartirdim
@ApiBearerAuth()
@Controller('tool-categories')
export class ToolCategoryController {
  constructor(private readonly toolCategoryService: ToolCategoryService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Yangi kategoriya yaratish (Soddalashtirilgan)' })
  @ApiBody({ type: CreateToolCategoryDto })
  @ApiResponse({ status: 201, description: 'Muvaffaqiyatli yaratildi.', type: ToolCategoryResponse })
  @ApiResponse({ status: 400, description: 'Xato so\'rov' })
  @ApiResponse({ status: 401, description: 'Avtorizatsiyadan o\'tilmagan' })
  create(@Body() createDto: CreateToolCategoryDto): Promise<ToolCategory> {
    return this.toolCategoryService.create(createDto);
  }

  @Get()
  // @UseGuards(JwtAuthGuard) // Public qilish uchun kommentga oling
  @ApiOperation({ summary: 'Kategoriyalar ro\'yxatini olish (Soddalashtirilgan)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'sortOrder', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiOkResponse({ description: 'Kategoriyalar ro\'yxati' /* type: [ToolCategoryResponse] */ }) // Javob sxemasini ko'rsatish mumkin
  findAll(@Query() queryDto: QueryToolCategoryDto) {
    return this.toolCategoryService.findAll(queryDto);
  }

  @Get(':id')
  // @UseGuards(JwtAuthGuard) // Public qilish uchun kommentga oling
  @ApiOperation({ summary: 'Bitta kategoriyani olish (Soddalashtirilgan)' })
  @ApiParam({ name: 'id', description: 'Kategoriya IDsi', type: String, format: 'uuid' })
  @ApiOkResponse({ description: 'Topilgan kategoriya', type: ToolCategoryResponse })
  @ApiResponse({ status: 404, description: 'Kategoriya topilmadi' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ToolCategory> {
    return this.toolCategoryService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Kategoriyani yangilash (Soddalashtirilgan)' })
  @ApiParam({ name: 'id', description: 'Kategoriya IDsi', type: String, format: 'uuid' })
  @ApiBody({ type: UpdateToolCategoryDto })
  @ApiOkResponse({ description: 'Muvaffaqiyatli yangilandi.', type: ToolCategoryResponse })
  @ApiResponse({ status: 404, description: 'Kategoriya topilmadi' })
  @ApiResponse({ status: 400, description: 'Xato so\'rov' })
  @ApiResponse({ status: 401, description: 'Avtorizatsiyadan o\'tilmagan' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateToolCategoryDto,
  ): Promise<ToolCategory> {
    return this.toolCategoryService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Kategoriyani o\'chirish (Soddalashtirilgan)' })
  @ApiParam({ name: 'id', description: 'Kategoriya IDsi', type: String, format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Muvaffaqiyatli o\'chirildi' })
  @ApiResponse({ status: 404, description: 'Kategoriya topilmadi' })
  @ApiResponse({ status: 409, description: 'Konflikt (bog\'liq asboblar mavjud)' })
  @ApiResponse({ status: 401, description: 'Avtorizatsiyadan o\'tilmagan' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.toolCategoryService.remove(id);
  }
}