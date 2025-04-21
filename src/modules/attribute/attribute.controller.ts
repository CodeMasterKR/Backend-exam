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
import { AttributeService } from './attribute.service';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { QueryAttributeDto } from './dto/query-attribute.dto.ts';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard'; 
import { Attribute, userRole } from '@prisma/client'; 
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../guards/roles.decorator';

@ApiTags('Attributes')
@ApiBearerAuth() 
@UseGuards(JwtAuthGuard, RolesGuard) 
@Controller('attributes')
export class AttributeController {
  constructor(private readonly attributeService: AttributeService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new attribute' })
  @ApiResponse({ status: 201, description: 'The attribute has been successfully created.', type: CreateAttributeDto })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async create(@Body() createAttributeDto: CreateAttributeDto): Promise<Attribute> {
    return this.attributeService.create(createAttributeDto);
  }


  @Roles(userRole.ADMIN, userRole.SUPERADMIN)
  @Get()
  @ApiOperation({ summary: 'Get a list of attributes with pagination, filtering, and sorting' })
  @ApiResponse({
    status: 200,
    description: 'List of attributes retrieved successfully.',
    schema: { 
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/Attribute' } 
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
        totalPages: { type: 'number' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'filter', required: false, type: String, description: 'Filter by name' })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['id', 'name'], description: 'Sort by field' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], description: 'Sort order' })
  async findAll(@Query() queryDto: QueryAttributeDto) {
    return this.attributeService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific attribute by ID' })
  @ApiResponse({ status: 200, description: 'Attribute found.', type: CreateAttributeDto }) 
  @ApiResponse({ status: 404, description: 'Attribute not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiParam({ name: 'id', description: 'Attribute ID (UUID)', type: String })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Attribute> {
    return this.attributeService.findOne(id);
  }

  @Roles(userRole.ADMIN, userRole.SUPERADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing attribute by ID' })
  @ApiResponse({ status: 200, description: 'Attribute updated successfully.', type: CreateAttributeDto }) 
  @ApiResponse({ status: 404, description: 'Attribute not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiParam({ name: 'id', description: 'Attribute ID (UUID)', type: String })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAttributeDto: UpdateAttributeDto,
  ): Promise<Attribute> {
    return this.attributeService.update(id, updateAttributeDto);
  }

  @Roles(userRole.ADMIN, userRole.SUPERADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) 
  @ApiOperation({ summary: 'Delete an attribute by ID' })
  @ApiResponse({ status: 204, description: 'Attribute deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Attribute not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiParam({ name: 'id', description: 'Attribute ID (UUID)', type: String })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.attributeService.remove(id);
  }
}