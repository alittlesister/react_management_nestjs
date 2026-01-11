// src/common/interceptors/logging.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() !== 'http') return next.handle();

    const request = context.switchToHttp().getRequest();
    const { method, url, ip, body } = request;
    const userAgent = request.get('user-agent') || '';
    const startTime = Date.now();

    this.logger.log(
      `→ ${method} ${url} - ${ip} - ${userAgent}`,
    );

    return next.handle().pipe(
      tap({
        next: (data) => {
          const endTime = Date.now();
          const duration = endTime - startTime;
          this.logger.log(
            `← ${method} ${url} - ${duration}ms`,
          );
        },
        error: (error) => {
          const endTime = Date.now();
          const duration = endTime - startTime;
          this.logger.error(
            `← ${method} ${url} - ${duration}ms - Error: ${error.message}`,
          );
        },
      }),
    );
  }
}
