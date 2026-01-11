// src/common/decorators/user-agent.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * 获取User-Agent
 * @example
 * async login(@UserAgent() userAgent: string) {
 *   console.log('User Agent:', userAgent);
 * }
 */
export const UserAgent = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers['user-agent'];
  },
);
