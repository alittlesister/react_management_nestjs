// src/common/interceptors/cache.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

export const CACHE_KEY_METADATA = 'cache_key';
export const CACHE_TTL_METADATA = 'cache_ttl';

export const CacheKey = (key: string) => SetMetadata(CACHE_KEY_METADATA, key);
export const CacheTTL = (ttl: number) => SetMetadata(CACHE_TTL_METADATA, ttl);

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private cache = new Map<string, { value: any; expireAt: number }>();

  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const cacheKey = this.reflector.get<string>(
      CACHE_KEY_METADATA,
      context.getHandler(),
    );

    if (!cacheKey) {
      return next.handle();
    }

    const ttl =
      this.reflector.get<number>(CACHE_TTL_METADATA, context.getHandler()) ||
      60000; // 默认60秒

    const request = context.switchToHttp().getRequest();
    const fullKey = `${cacheKey}_${JSON.stringify(request.query)}_${JSON.stringify(request.params)}`;

    const cached = this.cache.get(fullKey);
    if (cached && cached.expireAt > Date.now()) {
      return of(cached.value);
    }

    return next.handle().pipe(
      tap((data) => {
        this.cache.set(fullKey, {
          value: data,
          expireAt: Date.now() + ttl,
        });
      }),
    );
  }
}
