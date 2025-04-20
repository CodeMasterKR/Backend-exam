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
  ApiBearerAuth, // JWT uchun
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard'; // JWT Guard joylashuviga moslang
import { Master } from '@prisma/client'; // Javob turi uchun


// Namunaviy Master obyekt Swagger uchun
const masterExample = {
    id: 'b7a3c3f0-4b5a-4a1e-8c9a-7d6e5f4d3c2b',
    fullName: 'Jane Doe',
    phone: '+998917654321',
    isActive: true,
    dateBirth: '1995-10-20T00:00:00.000Z',
    experience: 3,
    image: 'https://example.com/images/jane.jpg',
    passportImage: 'https://example.com/passports/jane.jpg',
    star: 4.8,
    about: 'Friendly and experienced master.',
    createdAt: new Date().toISOString(), // Prisma avtomatik qo'shadi
    updatedAt: new Date().toISOString(), // Prisma avtomatik qo'shadi
    // MasterService[] ni qo'shish mumkin agar kerak bo'lsa
};


@ApiTags('Masters') // Swagger guruh nomi
@ApiBearerAuth() // Barcha endpointlar uchun JWT himoyasini bildiradi
@UseGuards(JwtAuthGuard) // Barcha endpointlarga JWT guardni qo'llash
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
  @ApiResponse({ status: 201, description: 'Master muvaffaqiyatli yaratildi.', type: CreateMasterDto /* Yoki Master turi */ })
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
           data: { type: 'array', items: { example: masterExample /* Schema to'liqroq bo'lishi kk*/ } },
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
    // Default qiymatlarni o'rnatish (DTOda qilingan bo'lsa ham, bu yerda ham mumkin)
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
    // ParseUUIDPipe IDning UUID formatida ekanligini tekshiradi
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
  @HttpCode(HttpStatus.NO_CONTENT) // Muvaffaqiyatli o'chirishda 204 statusini qaytarish
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<string> {
    return this.masterService.remove(id);
  }
}