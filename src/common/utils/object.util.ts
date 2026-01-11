// src/common/utils/object.util.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class ObjectUtil {
  /**
   * 深拷贝
   */
  deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * 判断是否为空对象
   */
  isEmpty(obj: Record<string, any>): boolean {
    return Object.keys(obj).length === 0;
  }

  /**
   * 移除对象中的空值（null, undefined, ''）
   */
  removeEmpty(obj: Record<string, any>): Record<string, any> {
    const result: Record<string, any> = {};
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      if (value !== null && value !== undefined && value !== '') {
        result[key] = value;
      }
    });
    return result;
  }

  /**
   * 挑选指定字段
   */
  pick<T extends Record<string, any>, K extends keyof T>(
    obj: T,
    keys: K[],
  ): Pick<T, K> {
    const result = {} as Pick<T, K>;
    keys.forEach((key) => {
      if (key in obj) {
        result[key] = obj[key];
      }
    });
    return result;
  }

  /**
   * 排除指定字段
   */
  omit<T extends Record<string, any>, K extends keyof T>(
    obj: T,
    keys: K[],
  ): Omit<T, K> {
    const result = { ...obj };
    keys.forEach((key) => {
      delete result[key];
    });
    return result as Omit<T, K>;
  }

  /**
   * 合并对象（深度合并）
   */
  merge<T extends Record<string, any>>(...objects: Partial<T>[]): T {
    const result = {} as T;
    objects.forEach((obj) => {
      Object.keys(obj).forEach((key) => {
        const value = obj[key];
        if (
          value &&
          typeof value === 'object' &&
          !Array.isArray(value) &&
          result[key] &&
          typeof result[key] === 'object'
        ) {
          (result as any)[key] = this.merge(result[key], value);
        } else {
          (result as any)[key] = value;
        }
      });
    });
    return result;
  }

  /**
   * 获取嵌套属性值
   * @param obj 对象
   * @param path 路径，如 'user.profile.name'
   * @param defaultValue 默认值
   */
  get(
    obj: Record<string, any>,
    path: string,
    defaultValue?: any,
  ): any {
    const keys = path.split('.');
    let result = obj;
    for (const key of keys) {
      if (result && typeof result === 'object' && key in result) {
        result = result[key];
      } else {
        return defaultValue;
      }
    }
    return result;
  }

  /**
   * 设置嵌套属性值
   * @param obj 对象
   * @param path 路径，如 'user.profile.name'
   * @param value 值
   */
  set(obj: Record<string, any>, path: string, value: any): void {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    let current = obj;
    for (const key of keys) {
      if (!(key in current) || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }
    current[lastKey] = value;
  }

  /**
   * 扁平化对象
   * @param obj 对象
   * @param prefix 前缀
   */
  flatten(obj: Record<string, any>, prefix = ''): Record<string, any> {
    const result: Record<string, any> = {};
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        Object.assign(result, this.flatten(value, newKey));
      } else {
        result[newKey] = value;
      }
    });
    return result;
  }

  /**
   * 对象数组去重
   * @param array 数组
   * @param key 去重依据的key
   */
  uniqueBy<T extends Record<string, any>>(array: T[], key: keyof T): T[] {
    const seen = new Set();
    return array.filter((item) => {
      const value = item[key];
      if (seen.has(value)) {
        return false;
      }
      seen.add(value);
      return true;
    });
  }
}
