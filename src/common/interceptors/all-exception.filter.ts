// src/common/filters/all-exception.filter.ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express'; // 如果你用的是 Fastify，见下方注释

type HttpExceptionBody =
  | string
  | {
      message?: string | string[];
      [key: string]: unknown;
    };

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // 如果你用 Fastify，可改成：
    // type ReplyLike = { status: (n: number) => ReplyLike; json: (v: unknown) => void };
    // const res = host.switchToHttp().getResponse<ReplyLike>();
    const res = host.switchToHttp().getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';
    let code = status;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      code = status;
      const body = exception.getResponse() as HttpExceptionBody;

      if (typeof body === 'string') {
        message = body;
      } else if (typeof body?.message === 'string') {
        message = body.message;
      } else if (Array.isArray(body?.message)) {
        message = body.message.join('; ');
      } else {
        message = exception.message ?? message;
      }
    } else if (exception instanceof Error) {
      message = exception.message || message;
    }

    res.status(status).json({
      code,
      message,
      data: null,
    });
  }
}
