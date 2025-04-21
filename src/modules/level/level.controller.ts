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
import { JwtAuthGuard } from '../guards/jwt-auth.guard'; 
import { RolesGuard } from '../guards/roles.guard';
import { Level as LevelModel, userRole } from '@prisma/client'; 

const createLevelExample = {
  name_uz: "Tajribali",
  name_en: "Experienced",
  name_ru: "Опытный",
  masterCategoryId: "uuid"
};

const updateLevelExample = {
  name_en: "Senior"
};


import { MasterCategory as MasterCategoryModel } from '@prisma/client'; 
import { Roles } from '../guards/roles.decorator';

class MasterCategoryBasicInfo {
    @ApiProperty({ example: 'uuid'})
    id: string;
     @ApiProperty({ example: 'Electrician'})
    name_en: string;
     @ApiProperty({ example: 'Elektrik'})
    name_uz: string;
     @ApiProperty({ example: 'Электрик'})
    name_ru: string;
}

class LevelResponse extends CreateLevelDto { 
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ type: () => MasterCategoryBasicInfo }) 
  masterCategory: MasterCategoryBasicInfo;
}

@ApiTags('Levels') 
@ApiBearerAuth()   
@Controller('levels') 
export class LevelController {
  constructor(private readonly levelService: LevelService) {}

  @Roles(userRole.ADMIN, userRole.SUPERADMIN)
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new Level' })
  @ApiBody({ type: CreateLevelDto, examples: { default: { value: createLevelExample } } })
  @ApiResponse({ status: 201, description: 'Successfully created.', type: LevelResponse }) 
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
                items: { $ref: '#/components/schemas/LevelResponse' } 
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


  @Roles(userRole.ADMIN, userRole.SUPERADMIN)
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


  @Roles(userRole.ADMIN, userRole.SUPERADMIN)
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a Level by ID' })
  @ApiParam({ name: 'id', required: true, type: String, format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.NO_CONTENT) 
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.levelService.remove(id);
  }
}