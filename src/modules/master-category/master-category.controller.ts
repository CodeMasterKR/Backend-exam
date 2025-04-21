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
import { MasterCategoryService } from './master-category.service';
import { CreateMasterCategoryDto } from './dto/create-master-category.dto';
import { UpdateMasterCategoryDto } from './dto/update-master-category.dto';
import { MasterCategoryQueryDto } from './dto/master-category-query.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { MasterCategory, userRole } from '@prisma/client';
import { Roles } from '../guards/roles.decorator';
@Roles(userRole.ADMIN, userRole.SUPERADMIN)

@ApiTags('Master Categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('master-categories')
export class MasterCategoryController {
  constructor(private readonly masterCategoryService: MasterCategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Yangi master kategoriya yaratish' })
  @ApiCreatedResponse({ description: 'Kategoriya muvaffaqiyatli yaratildi.'})
  @ApiResponse({ status: 400, description: 'Yaroqsiz ma\'lumotlar.' }) 
  @ApiResponse({ status: 401, description: 'Avtorizatsiyadan o\'tilmagan.' })
  @ApiResponse({ status: 409, description: 'Konflikt (masalan, unikal nom takrorlandi).' })
  create(@Body() createDto: CreateMasterCategoryDto): Promise<MasterCategory> {
    return this.masterCategoryService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha master kategoriyalarni olish (paginatsiya, filter, saralash bilan)' })
  @ApiOkResponse({ description: 'Kategoriyalar ro\'yxati.'  })
  @ApiResponse({ status: 401, description: 'Avtorizatsiyadan o\'tilmagan.' })
  findAll(@Query() queryDto: MasterCategoryQueryDto) {
    return this.masterCategoryService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'ID bo\'yicha bitta master kategoriyani olish' })
  @ApiParam({ name: 'id', description: 'Kategoriya UUIDsi', type: String })
  @ApiOkResponse({ description: 'Kategoriya ma\'lumotlari.' })
  @ApiResponse({ status: 404, description: 'Kategoriya topilmadi.' })
  @ApiResponse({ status: 401, description: 'Avtorizatsiyadan o\'tilmagan.' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<MasterCategory> {
    return this.masterCategoryService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'ID bo\'yicha master kategoriyani yangilash' })
  @ApiParam({ name: 'id', description: 'Kategoriya UUIDsi', type: String })
  @ApiOkResponse({ description: 'Kategoriya muvaffaqiyatli yangilandi.'})
  @ApiResponse({ status: 404, description: 'Kategoriya topilmadi.' })
  @ApiResponse({ status: 400, description: 'Yaroqsiz ma\'lumotlar.' })
  @ApiResponse({ status: 401, description: 'Avtorizatsiyadan o\'tilmagan.' })
  @ApiResponse({ status: 409, description: 'Konflikt (masalan, unikal nom takrorlandi).' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateMasterCategoryDto,
  ): Promise<MasterCategory> {
    return this.masterCategoryService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'ID bo\'yicha master kategoriyani o\'chirish' })
  @ApiParam({ name: 'id', description: 'Kategoriya UUIDsi', type: String })
  @ApiOkResponse({ description: 'Kategoriya muvaffaqiyatli o\'chirildi.'})
  @ApiResponse({ status: 404, description: 'Kategoriya topilmadi.' })
  @ApiResponse({ status: 409, description: 'O\'chirib bo\'lmadi (bog\'liqliklar mavjud).' })
  @ApiResponse({ status: 401, description: 'Avtorizatsiyadan o\'tilmagan.' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<string> {
    return this.masterCategoryService.remove(id);
  }
}