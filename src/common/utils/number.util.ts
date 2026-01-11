// src/common/utils/number.util.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class NumberUtil {
  /**
   * 生成随机整数
   * @param min 最小值
   * @param max 最大值
   */
  randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * 保留小数位
   * @param num 数字
   * @param digits 小数位数
   */
  toFixed(num: number, digits = 2): number {
    return Number(num.toFixed(digits));
  }

  /**
   * 格式化金额
   * @param amount 金额
   * @param decimals 小数位
   */
  formatMoney(amount: number, decimals = 2): string {
    return amount.toFixed(decimals).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }

  /**
   * 百分比
   * @param numerator 分子
   * @param denominator 分母
   * @param digits 小数位数
   */
  percentage(numerator: number, denominator: number, digits = 2): number {
    if (denominator === 0) return 0;
    return this.toFixed((numerator / denominator) * 100, digits);
  }

  /**
   * 数字转中文
   */
  toChinese(num: number): string {
    const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    const units = ['', '十', '百', '千', '万'];
    const str = String(num);
    let result = '';
    for (let i = 0; i < str.length; i++) {
      const digit = parseInt(str[i]);
      const unit = units[str.length - i - 1];
      result += digits[digit] + (digit !== 0 ? unit : '');
    }
    return result.replace(/零+/g, '零').replace(/零$/, '');
  }

  /**
   * 判断是否在区间内
   */
  inRange(num: number, min: number, max: number): boolean {
    return num >= min && num <= max;
  }

  /**
   * 限制在区间内
   */
  clamp(num: number, min: number, max: number): number {
    return Math.min(Math.max(num, min), max);
  }

  /**
   * 求和
   */
  sum(numbers: number[]): number {
    return numbers.reduce((acc, curr) => acc + curr, 0);
  }

  /**
   * 平均值
   */
  average(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    return this.sum(numbers) / numbers.length;
  }

  /**
   * 最大值
   */
  max(numbers: number[]): number {
    return Math.max(...numbers);
  }

  /**
   * 最小值
   */
  min(numbers: number[]): number {
    return Math.min(...numbers);
  }
}
