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
  HttpStatus,
} from '@nestjs/common';
import { RegionService } from './region.service';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { RegionFilterDto } from './dto/filter-region.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBearerAuth, 
  ApiBody,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport'; 
@ApiBearerAuth() 
@Controller('regions')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  // @UseGuards(AuthGuard('jwt')) 
  @Post()
  @ApiOperation({ summary: 'Yangi region yaratish' })
  @ApiBody({ type: CreateRegionDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Region muvaffaqiyatli yaratildi.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST, 
    description: 'Xatolik yuz berdi (masalan, bunday nomli region mavjud).',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Avtorizatsiyadan o\'tilmagan.',
  })
  create(@Body() createRegionDto: CreateRegionDto) {
    return this.regionService.create(createRegionDto.name);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiOperation({ summary: 'Barcha regionlarni filter va pagination bilan olish' })
  @ApiQuery({ name: 'name', required: false, type: String, description: 'Region nomi bo\'yicha qidirish (case-insensitive)' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Sahifa raqami', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Har bir sahifadagi elementlar soni', example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['name', 'createdAt'], description: 'Saralash maydoni', example: 'createdAt' })
  @ApiQuery({ name: 'order', required: false, enum: ['asc', 'desc'], description: 'Saralash tartibi', example: 'asc' })
  @ApiResponse({
    status: HttpStatus.OK, 
    description: 'Regionlar ro\'yxati muvaffaqiyatli olindi.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Avtorizatsiyadan o\'tilmagan.',
  })
  findAll(@Query() regionFilterDto: RegionFilterDto) {
    return this.regionService.findAll(regionFilterDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @ApiOperation({ summary: 'Regionni ID bo\'yicha olish' })
  @ApiParam({ name: 'id', description: 'Regionning unikal IDsi', type: String }) 
  @ApiResponse({
    status: HttpStatus.OK, 
    description: 'Region ma\'lumotlari muvaffaqiyatli olindi.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST, 
    description: 'Region topilmadi yoki ID formati noto\'g\'ri.', 
  })
   @ApiResponse({
    status: HttpStatus.NOT_FOUND, 
    description: 'Region topilmadi.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Avtorizatsiyadan o\'tilmagan.',
  })
  findOne(@Param('id') id: string) {
    return this.regionService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt')) 
  @Patch(':id')
  @ApiOperation({ summary: 'Regionni ID bo\'yicha yangilash' })
  @ApiParam({ name: 'id', description: 'Yangilanadigan regionning IDsi', type: String })
  @ApiBody({ type: UpdateRegionDto })
  @ApiResponse({
    status: HttpStatus.OK, 
    description: 'Region muvaffaqiyatli yangilandi.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST, 
    description: 'Region topilmadi yoki yuborilgan ma\'lumot noto\'g\'ri.', 
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND, 
    description: 'Region topilmadi.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Avtorizatsiyadan o\'tilmagan.',
  })
  update(@Param('id') id: string, @Body() updateRegionDto: UpdateRegionDto) {
    return this.regionService.update(id, updateRegionDto.name);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiOperation({ summary: 'Regionni ID bo\'yicha o\'chirish' })
  @ApiParam({ name: 'id', description: 'O\'chiriladigan regionning IDsi', type: String })
  @ApiResponse({
    status: HttpStatus.OK, 
    description: 'Region muvaffaqiyatli o\'chirildi.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Region topilmadi yoki ID formati noto\'g\'ri.', // Servis BadRequest qaytaradi
  })
    @ApiResponse({
    status: HttpStatus.NOT_FOUND, 
    description: 'Region topilmadi.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Avtorizatsiyadan o\'tilmagan.',
  })
  remove(@Param('id') id: string) {
    return this.regionService.remove(id);
  }
}