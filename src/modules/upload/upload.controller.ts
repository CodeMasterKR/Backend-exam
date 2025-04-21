import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from './../../utils/file-upload.utils'; 
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse
} from '@nestjs/swagger';
import { Express } from 'express'; 

@ApiTags('Uploads')
@Controller('uploads')
export class UploadController {

  @Post() 
  @ApiOperation({ summary: 'Upload a single file (e.g., image)' })
  @ApiConsumes('multipart/form-data') 
  @ApiBody({ 
    schema: {
      type: 'object',
      properties: {
        file: { 
          type: 'string',
          format: 'binary',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'File uploaded successfully.'})
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid file type or size.'})
  @UseInterceptors( 
    FileInterceptor('file', { 
      storage: diskStorage({ 
        destination: './public/uploads', 
        filename: editFileName, 
      }),
      fileFilter: imageFileFilter, 
      limits: {
          fileSize: 1024 * 1024 * 5 
      }
    }),
  )
  async uploadSingleFile(
    @UploadedFile(
    ) file: Express.Multer.File
  ) {

    if (!file) {
        throw new HttpException('File upload failed. Make sure the file field name is correct and file is provided.', HttpStatus.BAD_REQUEST);
    }
    const response = {
      originalname: file.originalname,
      filename: file.filename,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype,
    };
    return response;
  }
}