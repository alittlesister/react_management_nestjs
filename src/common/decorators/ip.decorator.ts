// src/common/decorators/ip.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * 获取客户端IP地址
 * @example
 * async login(@Ip() ip: string) {
 *   console.log('Login from IP:', ip);
 * }
 */
export const Ip = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return (
      request.headers['x-forwarded-for']?.split(',')[0] ||
      request.headers['x-real-ip'] ||
      request.connection.remoteAddress ||
      request.socket.remoteAddress ||
      request.ip
    );
  },
);
