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
import { LevelService } from './level.service';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { QueryLevelDto } from './dto/query-level.dto';
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
import { JwtAuthGuard } from '../guards/jwt-auth.guard'; // Guard manzilingizni moslang
import { Level as LevelModel } from '@prisma/client'; // Javob turi uchun

// Swagger uchun DTO Examplelar
const createLevelExample = {
  name_uz: "Tajribali",
  name_en: "Experienced",
  name_ru: "Опытный",
  masterCategoryId: "f47ac10b-58cc-4372-a567-0e02b2c3d479"
};

const updateLevelExample = {
  name_en: "Senior"
};


import { MasterCategory as MasterCategoryModel } from '@prisma/client'; // Agar MasterCategory uchun ham schema kerak bo'lsa

// Agar MasterCategory uchun alohida DTO/Schema bo'lmasa, shu yerda oddiy schema yaratish mumkin
class MasterCategoryBasicInfo {
    @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479'})
    id: string;
     @ApiProperty({ example: 'Electrician'})
    name_en: string;
     @ApiProperty({ example: 'Elektrik'})
    name_uz: string;
     @ApiProperty({ example: 'Электрик'})
    name_ru: string;
}

class LevelResponse extends CreateLevelDto { // CreateLevelDto dan meros olish qulay
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  id: string;

  // masterCategoryId DTO da bor, lekin javobda to'liq Category ni ko'rsatish yaxshi
  @ApiProperty({ type: () => MasterCategoryBasicInfo }) // Javobda bog'liq obyektni ko'rsatish
  masterCategory: MasterCategoryBasicInfo;
}
// --- End Swagger Schema Definition ---


@ApiTags('Levels') // Swagger UI guruh nomi
@ApiBearerAuth()   // JWT avtorizatsiyasi
@Controller('levels') // Endpoint manzili
export class LevelController {
  constructor(private readonly levelService: LevelService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new Level' })
  @ApiBody({ type: CreateLevelDto, examples: { default: { value: createLevelExample } } })
  @ApiResponse({ status: 201, description: 'Successfully created.', type: LevelResponse }) // Javob schemasini ko'rsatish
  @ApiResponse({ status: 400, description: 'Bad Request (Validation failed, Invalid masterCategoryId)' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createLevelDto: CreateLevelDto): Promise<LevelModel> {
    return this.levelService.create(createLevelDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all Levels with pagination, sorting, and filtering' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String, example: 'name_en' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by name (uz, en, ru)' })
  @ApiQuery({ name: 'masterCategoryId', required: false, type: String, format: 'uuid' })
  @ApiOkResponse({
    description: 'List of levels with pagination.',
    schema: {
        properties: {
            data: {
                type: 'array',
                items: { $ref: '#/components/schemas/LevelResponse' } // Yuqorida yaratilgan schema
            },
            total: { type: 'number', example: 50 },
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
        }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Query() queryDto: QueryLevelDto) {
    return this.levelService.findAll(queryDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a single Level by ID' })
  @ApiParam({ name: 'id', required: true, type: String, format: 'uuid' })
  @ApiResponse({ status: 200, description: 'The found record.', type: LevelResponse })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<LevelModel> {
    return this.levelService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a Level by ID' })
  @ApiParam({ name: 'id', required: true, type: String, format: 'uuid' })
  @ApiBody({ type: UpdateLevelDto, examples: { default: { value: updateLevelExample } } })
  @ApiResponse({ status: 200, description: 'Successfully updated.', type: LevelResponse })
  @ApiResponse({ status: 400, description: 'Bad Request (Validation failed, Invalid masterCategoryId)' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateLevelDto: UpdateLevelDto,
  ): Promise<LevelModel> {
    return this.levelService.update(id, updateLevelDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a Level by ID' })
  @ApiParam({ name: 'id', required: true, type: String, format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.NO_CONTENT) // Javob qaytarmaydi
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.levelService.remove(id);
  }
}