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
import { ToolAttributeService } from './tool-attribute.service';
import { CreateToolAttributeDto } from './dto/create-tool-attribute.dto';
import { UpdateToolAttributeDto } from './dto/update-tool-attribute.dto';
import { QueryToolAttributeDto } from './dto/query-tool-attribute.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport'; 
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../guards/roles.decorator';
import { userRole } from '@prisma/client';
@ApiTags('tool-attribute')
@ApiBearerAuth() 
@UseGuards(AuthGuard('jwt')) 
@Controller('tool-attributes')
export class ToolAttributeController {
  constructor(private readonly toolAttributeService: ToolAttributeService) {}

  @Roles(userRole.ADMIN, userRole.SUPERADMIN)
  @Post()
  @ApiOperation({ summary: 'Create a new tool attribute link' })
  @ApiResponse({ status: 201, description: 'The record has been successfully created.' }) 
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Related Tool or Attribute not found.' })
  create(@Body() createToolAttributeDto: CreateToolAttributeDto) {
    return this.toolAttributeService.create(createToolAttributeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all tool attributes with filtering, pagination, and sorting' })
  @ApiQuery({ name: 'toolId', required: false, type: String, description: 'Filter by Tool ID' })
  @ApiQuery({ name: 'attributeId', required: false, type: String, description: 'Filter by Attribute ID' })
  @ApiQuery({ name: 'value', required: false, type: String, description: 'Filter by partial value match' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page', example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Field to sort by (e.g., value)'})
  @ApiQuery({ name: 'order', required: false, enum: ['asc', 'desc'], description: 'Sort order' })
  @ApiResponse({ status: 200, description: 'List of tool attributes.', })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAll(@Query() queryDto: QueryToolAttributeDto) {
    return this.toolAttributeService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific tool attribute by ID' })
  @ApiParam({ name: 'id', description: 'UUID of the tool attribute', type: String })
  @ApiResponse({ status: 200, description: 'Tool attribute details.'})
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'ToolAttribute not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.toolAttributeService.findOne(id);
  }

  @Roles(userRole.ADMIN, userRole.SUPERADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a tool attribute by ID' })
  @ApiParam({ name: 'id', description: 'UUID of the tool attribute to update', type: String })
  @ApiResponse({ status: 200, description: 'The record has been successfully updated.'})
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'ToolAttribute, related Tool or Attribute not found.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateToolAttributeDto: UpdateToolAttributeDto,
  ) {
    return this.toolAttributeService.update(id, updateToolAttributeDto);
  }

  @Roles(userRole.ADMIN, userRole.SUPERADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) 
  @ApiOperation({ summary: 'Delete a tool attribute by ID' })
  @ApiParam({ name: 'id', description: 'UUID of the tool attribute to delete', type: String })
  @ApiResponse({ status: 204, description: 'The record has been successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'ToolAttribute not found.' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
     await this.toolAttributeService.remove(id);
  }
}