import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '@prisma/client'; // Prisma xatolik turlari uchun

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>(); // Agar request info kerak bo'lsa
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error occurred';

    console.error("Prisma Error Code:", exception.code); // Xatolikni log qilish
    console.error("Prisma Error Meta:", exception.meta); // Qo'shimcha ma'lumot

    switch (exception.code) {
      case 'P2002': // Unique constraint failed
        status = HttpStatus.CONFLICT; // 409
        message = `Duplicate field value: ${exception.meta?.target?.toString() ?? 'Unique constraint violation'}`;
        break;
      case 'P2025': // Record to update/delete not found
        status = HttpStatus.NOT_FOUND; // 404
        message = exception.meta?.cause?.toString() ?? 'Resource not found';
        // Yoki controllerdagi kabi aniqroq xabar berish uchun contextdan foydalanish mumkin
        // message = `Resource with specified identifier not found`;
        break;
      case 'P2003': // Foreign key constraint failed
         status = HttpStatus.BAD_REQUEST; // 400
         message = `Foreign key constraint failed on the field: ${exception.meta?.field_name ?? 'unknown field'}`;
         break;
      // Boshqa kerakli Prisma xatolik kodlarini qo'shish mumkin
      // https://www.prisma.io/docs/reference/api-reference/error-reference#prisma-client-query-engine
      default:
        // Boshqa barcha Prisma xatoliklari uchun umumiy javob
        status = HttpStatus.BAD_REQUEST; // Yoki 500
        message = `Prisma Error ${exception.code}: Something went wrong with the database operation.`;
        break;
    }

     // HttpException dan meros olgan xatolar uchun status va message ni olish
     if (exception instanceof HttpException) {
        status = exception.getStatus();
        const exceptionResponse = exception.getResponse();
        message = typeof exceptionResponse == 'string' ? exceptionResponse : (exceptionResponse as any)?.message || message;
     }

    response.status(status).json({
      statusCode: status,
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url, // So'rov yo'lini qo'shish
    });
  }
}