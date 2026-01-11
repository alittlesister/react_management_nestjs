// src/common/interceptors/transform.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  SetMetadata,
  StreamableFile,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export const SKIP_TRANSFORM_KEY = 'skipTransform';
export const SkipTransform = () => SetMetadata(SKIP_TRANSFORM_KEY, true);

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    // 只处理 HTTP
    if (ctx.getType() !== 'http') return next.handle();

    // 可在类/方法上用 @SkipTransform() 跳过统一包装
    const skip = this.reflector.getAllAndOverride<boolean>(SKIP_TRANSFORM_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (skip) return next.handle();

    return next.handle().pipe(
      map((data) => {
        // 文件/流不包装
        if (data instanceof StreamableFile || data instanceof Buffer)
          return data;

        // 已经是统一结构的就不再二次包装（便于渐进迁移/特殊接口）
        if (
          data &&
          typeof data === 'object' &&
          'code' in data &&
          'message' in data
        ) {
          return data as unknown;
        }

        // 最简单的统一结构
        return { code: 0, message: 'ok', data: data as unknown };
      }),
    );
  }
}
