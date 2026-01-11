// src/common/filters/http-exception.filter.ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse();
    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as any).message || exception.message;

    const errorResponse = {
      code: status,
      message: Array.isArray(message) ? message.join('; ') : message,
      data: null,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${JSON.stringify(errorResponse)}`,
    );

    response.status(status).json(errorResponse);
  }
}
