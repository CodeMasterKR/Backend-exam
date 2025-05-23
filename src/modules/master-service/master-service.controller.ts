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
import { MasterServiceService } from './master-service.service';
import { CreateMasterServiceDto } from './dto/create-master-service.dto';
import { UpdateMasterServiceDto } from './dto/update-master-service.dto';
import { QueryMasterServiceDto } from './dto/query-master-service.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
  ApiBearerAuth, 
  ApiOkResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard'; 
import { MasterService as MasterServiceModel, userRole } from '@prisma/client';
import { Roles } from '../guards/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';

const createExample = {
  masterCategoryId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  masterId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  minWorkingHours: 2,
  priceHourly: 55.0,
  priceDaily: 400.0,
  experience: 4,
};

const updateExample = {
  priceHourly: 60.0,
  experience: 5,
};

@ApiTags('Master Services') 
@ApiBearerAuth() 
@Controller('master-services') 
@Roles(userRole.ADMIN, userRole.SUPERADMIN)
export class MasterServiceController {
  constructor(private readonly masterServiceService: MasterServiceService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new Master Service relation' })
  @ApiBody({ type: CreateMasterServiceDto, examples: { default: { value: createExample } } })
  @ApiResponse({ status: 201, description: 'Successfully created.', type: CreateMasterServiceDto })
  @ApiResponse({ status: 400, description: 'Bad Request (Validation failed, Price constraint violated, etc.)' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() createMasterServiceDto: CreateMasterServiceDto) {
    return this.masterServiceService.create(createMasterServiceDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all Master Services with pagination, sorting, and filtering' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Field to sort by (e.g., priceHourly, experience)' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], description: 'Sort order' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search term (not fully implemented)' })
  @ApiQuery({ name: 'masterId', required: false, type: String, format: 'uuid', description: 'Filter by Master ID' })
  @ApiQuery({ name: 'masterCategoryId', required: false, type: String, format: 'uuid', description: 'Filter by MasterCategory ID' })
  @ApiOkResponse({
    description: 'List of master services with pagination.',
    schema: {
        properties: {
            data: {
                type: 'array',
                items: { $ref: '#/components/schemas/MasterService' } 
            },
            total: { type: 'number', example: 100 },
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
        }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Query() queryDto: QueryMasterServiceDto) {
    return this.masterServiceService.findAll(queryDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a single Master Service by ID' })
  @ApiParam({ name: 'id', required: true, description: 'Master Service ID', type: String, format: 'uuid' })
  @ApiResponse({ status: 200, description: 'The found record.', type: CreateMasterServiceDto })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.masterServiceService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a Master Service by ID' })
  @ApiParam({ name: 'id', required: true, description: 'Master Service ID', type: String, format: 'uuid' })
  @ApiBody({ type: UpdateMasterServiceDto, examples: { default: { value: updateExample } } })
  @ApiResponse({ status: 200, description: 'Successfully updated.', type: CreateMasterServiceDto})
  @ApiResponse({ status: 400, description: 'Bad Request (Validation failed, Price constraint violated, etc.)' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMasterServiceDto: UpdateMasterServiceDto,
  ) {
    return this.masterServiceService.update(id, updateMasterServiceDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a Master Service by ID' })
  @ApiParam({ name: 'id', required: true, description: 'Master Service ID', type: String, format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.NO_CONTENT) 
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.masterServiceService.remove(id);
  }
}