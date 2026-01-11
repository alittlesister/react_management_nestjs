// src/common/guards/throttle.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Injectable()
export class ThrottleGuard implements CanActivate {
  private requests: Map<string, number[]> = new Map();
  private readonly ttl: number; // 时间窗口（毫秒）
  private readonly limit: number; // 限制次数

  constructor(ttl = 60000, limit = 10) {
    this.ttl = ttl;
    this.limit = limit;
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const ip =
      request.headers['x-forwarded-for']?.split(',')[0] ||
      request.headers['x-real-ip'] ||
      request.connection.remoteAddress;

    const now = Date.now();
    const timestamps = this.requests.get(ip) || [];

    const validTimestamps = timestamps.filter(
      (timestamp) => now - timestamp < this.ttl,
    );

    if (validTimestamps.length >= this.limit) {
      throw new HttpException(
        '请求过于频繁，请稍后再试',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    validTimestamps.push(now);
    this.requests.set(ip, validTimestamps);

    return true;
  }
}
