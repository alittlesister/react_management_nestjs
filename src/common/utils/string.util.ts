// src/common/utils/string.util.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class StringUtil {
  /**
   * 驼峰转下划线
   */
  camelToSnake(str: string): string {
    return str.replace(/([A-Z])/g, '_$1').toLowerCase();
  }

  /**
   * 下划线转驼峰
   */
  snakeToCamel(str: string): string {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  /**
   * 首字母大写
   */
  capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * 首字母小写
   */
  uncapitalize(str: string): string {
    return str.charAt(0).toLowerCase() + str.slice(1);
  }

  /**
   * 截断字符串
   * @param str 字符串
   * @param length 长度
   * @param suffix 后缀
   */
  truncate(str: string, length: number, suffix = '...'): string {
    if (str.length <= length) return str;
    return str.slice(0, length) + suffix;
  }

  /**
   * 移除空格
   */
  removeSpaces(str: string): string {
    return str.replace(/\s+/g, '');
  }

  /**
   * 判断是否为空字符串
   */
  isEmpty(str: string | null | undefined): boolean {
    return !str || str.trim().length === 0;
  }

  /**
   * 判断是否不为空
   */
  isNotEmpty(str: string | null | undefined): boolean {
    return !this.isEmpty(str);
  }

  /**
   * 手机号脱敏
   */
  maskPhone(phone: string): string {
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  }

  /**
   * 邮箱脱敏
   */
  maskEmail(email: string): string {
    return email.replace(/(.{2}).*(@.*)/, '$1***$2');
  }

  /**
   * 身份证脱敏
   */
  maskIdCard(idCard: string): string {
    return idCard.replace(/(\d{6})\d{8}(\d{4})/, '$1********$2');
  }

  /**
   * 随机字符串
   * @param length 长度
   * @param chars 字符集
   */
  random(
    length = 8,
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  ): string {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * 替换所有匹配项
   */
  replaceAll(str: string, search: string, replacement: string): string {
    return str.split(search).join(replacement);
  }

  /**
   * 判断是否包含中文
   */
  hasChinese(str: string): boolean {
    return /[\u4e00-\u9fa5]/.test(str);
  }
}
