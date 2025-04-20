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
import { ToolService } from './tool.service';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { QueryToolDto } from './dto/query-tool.dto';
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
import { Tool } from '@prisma/client';

@ApiTags('Tools')
@ApiBearerAuth()
@Controller('tools')
export class ToolController {
  constructor(private readonly toolService: ToolService) {}

  createExample: CreateToolDto ;
  private updateExample: UpdateToolDto;

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new tool' })
  @ApiBody({ type: CreateToolDto, examples: { default: { value: { name_uz: "Ombur", name_en: "Pliers", name_ru: "Плоскогубцы", price: 35000, quantity: 50, toolSubCategoryId: "a1b2c3d4-e5f6-7890-1234-567890abcdef", brand: "Stanley" } } } })
  @ApiResponse({ status: 201, description: 'Tool created successfully.', type: CreateToolDto })
  @ApiResponse({ status: 400, description: 'Bad Request (Validation failed, Invalid Category ID)' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createDto: CreateToolDto): Promise<Tool> {
    return this.toolService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get tools with pagination, sorting, filtering' })
  @ApiOkResponse({ description: 'List of tools.' })
  findAll(@Query() queryDto: QueryToolDto) {
    return this.toolService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single tool by ID' })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @ApiOkResponse({ description: 'Tool details.', type: CreateToolDto }) // Specify a ToolResponse DTO if needed
  @ApiResponse({ status: 404, description: 'Tool not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Tool> {
    return this.toolService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a tool by ID' })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @ApiBody({ type: UpdateToolDto, examples: { default: { value: { price: 36500, quantity: 45 } } } })
  @ApiOkResponse({ description: 'Tool updated successfully.', type: CreateToolDto }) // Specify a ToolResponse DTO if needed
  @ApiResponse({ status: 404, description: 'Tool not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateToolDto,
  ): Promise<Tool> {
    return this.toolService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a tool by ID' })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Tool deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Tool not found' })
  @ApiResponse({ status: 409, description: 'Conflict (Tool is referenced)' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.toolService.remove(id);
  }
}