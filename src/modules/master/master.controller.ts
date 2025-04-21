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
import { MasterService } from './master.service';
import { CreateMasterDto } from './dto/create-master.dto';
import { UpdateMasterDto } from './dto/update-master.dto';
import { QueryMasterDto } from './dto/query-master.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard'; 
import { Master, userRole } from '@prisma/client';
import { Roles } from '../guards/roles.decorator';


const masterExample = {
    id: 'uuid',
    fullName: 'Ibrohimov Kamron',
    phone: '+998945895766',
    isActive: true,
    dateBirth: '10-09-2003',
    experience: 3,
    image: 'https://example.com/images/kamron.jpg',
    passportImage: 'https://example.com/passports/kamron.jpg',
    star: 4.8,
    about: 'Friendly and experienced master.',
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString(), 
};



@ApiTags('Masters') 
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard) 
@Roles(userRole.ADMIN, userRole.SUPERADMIN)
@Controller('masters')
export class MasterController {
  constructor(private readonly masterService: MasterService) {}

  @Post()
  @ApiOperation({ summary: 'Yangi Master yaratish' })
  @ApiBody({ type: CreateMasterDto, examples: {
      'example1': {
          summary: 'Oddiy misol',
          value: "dfsdf"
      }
  }})
  @ApiResponse({ status: 201, description: 'Master muvaffaqiyatli yaratildi.', type: CreateMasterDto })
  @ApiResponse({ status: 400, description: 'Noto‘g‘ri kiritish maʼlumotlari.' })
  @ApiResponse({ status: 401, description: 'Avtorizatsiyadan oʻtilmagan.' })
  create(@Body() createMasterDto: CreateMasterDto): Promise<Master> {
    return this.masterService.create(createMasterDto);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha Masterlarni paginatsiya, saralash va filtrlash bilan olish' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Sahifa raqami' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Har bir sahifadagi elementlar soni' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Saralash maydoni', enum: ['fullName', 'experience', 'star', 'dateBirth', 'createdAt'] })
  @ApiQuery({ name: 'sortOrder', required: false, type: String, description: 'Saralash tartibi', enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Qidiruv satri' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean, description: 'Faqat aktiv masterlar'})
  @ApiResponse({
    status: 200,
    description: 'Masterlar roʻyxati va paginatsiya maʼlumotlari.',
    schema: {
       properties: {
           data: { type: 'array', items: { example: masterExample } },
           meta: {
               type: 'object',
               properties: {
                   totalItems: { type: 'number', example: 100 },
                   itemCount: { type: 'number', example: 10 },
                   itemsPerPage: { type: 'number', example: 10 },
                   totalPages: { type: 'number', example: 10 },
                   currentPage: { type: 'number', example: 1 },
               }
           }
       }
    }
  })
  @ApiResponse({ status: 401, description: 'Avtorizatsiyadan oʻtilmagan.' })
  findAll(@Query() queryDto: QueryMasterDto) {
    const defaults: QueryMasterDto = { page: 1, limit: 10, sortBy: 'fullName', sortOrder: 'asc'};
    const queryParams = { ...defaults, ...queryDto };
    return this.masterService.findAll(queryParams);
  }

  @Get(':id')
  @ApiOperation({ summary: 'ID boʻyicha bitta Master maʼlumotlarini olish' })
  @ApiParam({ name: 'id', description: 'Master ID (UUID formatida)', type: String, example: 'b7a3c3f0-4b5a-4a1e-8c9a-7d6e5f4d3c2b' })
  @ApiResponse({ status: 200, description: 'Master maʼlumotlari topildi.', schema: { example: masterExample } })
  @ApiResponse({ status: 404, description: 'Master topilmadi.' })
  @ApiResponse({ status: 400, description: 'Notoʻgʻri ID formati (UUID emas).' })
  @ApiResponse({ status: 401, description: 'Avtorizatsiyadan oʻtilmagan.' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Master> {
    return this.masterService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'ID boʻyicha Master maʼlumotlarini yangilash' })
  @ApiParam({ name: 'id', description: 'Yangilanadigan Master ID (UUID)', type: String, example: 'b7a3c3f0-4b5a-4a1e-8c9a-7d6e5f4d3c2b' })
  @ApiBody({ type: UpdateMasterDto, examples: {
      'update_name': {
          summary: 'Faqat ismni yangilash',
          value: { fullName: 'Updated Name' } as UpdateMasterDto
      },
      'update_status': {
          summary: 'Statusni yangilash',
          value: { isActive: false } as UpdateMasterDto
      }
  }})
  @ApiResponse({ status: 200, description: 'Master muvaffaqiyatli yangilandi.', schema: { example: { ...masterExample, fullName: 'Updated Name' } } })
  @ApiResponse({ status: 404, description: 'Yangilanadigan Master topilmadi.' })
  @ApiResponse({ status: 400, description: 'Notoʻgʻri kiritish maʼlumotlari yoki ID formati.' })
  @ApiResponse({ status: 401, description: 'Avtorizatsiyadan oʻtilmagan.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMasterDto: UpdateMasterDto,
  ): Promise<Master> {
    return this.masterService.update(id, updateMasterDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'ID boʻyicha Masterni oʻchirish' })
  @ApiParam({ name: 'id', description: 'Oʻchiriladigan Master ID (UUID)', type: String, example: 'b7a3c3f0-4b5a-4a1e-8c9a-7d6e5f4d3c2b' })
  @ApiResponse({ status: 204, description: 'Master muvaffaqiyatli oʻchirildi (kontent yoʻq).' })
  @ApiResponse({ status: 404, description: 'Oʻchiriladigan Master topilmadi.' })
  @ApiResponse({ status: 400, description: 'Notoʻgʻri ID formati (UUID emas).' })
  @ApiResponse({ status: 401, description: 'Avtorizatsiyadan oʻtilmagan.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<string> {
    return this.masterService.remove(id);
  }
}