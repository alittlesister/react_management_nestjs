// src/common/utils/date.util.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class DateUtil {
  /**
   * 格式化日期
   * @param date 日期对象
   * @param format 格式字符串，如 'YYYY-MM-DD HH:mm:ss'
   */
  format(date: Date = new Date(), format = 'YYYY-MM-DD HH:mm:ss'): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return format
      .replace('YYYY', String(year))
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  }

  /**
   * 获取当前时间戳（秒）
   */
  timestamp(): number {
    return Math.floor(Date.now() / 1000);
  }

  /**
   * 获取当前时间戳（毫秒）
   */
  timestampMs(): number {
    return Date.now();
  }

  /**
   * 日期加减
   * @param date 基准日期
   * @param amount 数量
   * @param unit 单位：'day' | 'hour' | 'minute' | 'second'
   */
  add(
    date: Date,
    amount: number,
    unit: 'day' | 'hour' | 'minute' | 'second' = 'day',
  ): Date {
    const result = new Date(date);
    switch (unit) {
      case 'day':
        result.setDate(result.getDate() + amount);
        break;
      case 'hour':
        result.setHours(result.getHours() + amount);
        break;
      case 'minute':
        result.setMinutes(result.getMinutes() + amount);
        break;
      case 'second':
        result.setSeconds(result.getSeconds() + amount);
        break;
    }
    return result;
  }

  /**
   * 判断日期是否过期
   * @param date 要检查的日期
   */
  isExpired(date: Date): boolean {
    return date.getTime() < Date.now();
  }

  /**
   * 获取日期范围
   * @param start 开始日期
   * @param end 结束日期
   */
  getDateRange(start: Date, end: Date): Date[] {
    const dates: Date[] = [];
    const current = new Date(start);
    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }

  /**
   * 获取今天的开始时间
   */
  startOfToday(): Date {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }

  /**
   * 获取今天的结束时间
   */
  endOfToday(): Date {
    const date = new Date();
    date.setHours(23, 59, 59, 999);
    return date;
  }
}
