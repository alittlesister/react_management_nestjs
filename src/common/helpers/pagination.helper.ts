// src/common/helpers/pagination.helper.ts
import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder, ObjectLiteral } from 'typeorm';

export interface PaginationOptions {
  pageNum: number;
  pageSize: number;
}

export interface PaginationResult<T> {
  data: T[];
  total: number;
  pageNum: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

@Injectable()
export class PaginationHelper {
  /**
   * 使用 QueryBuilder 进行分页查询
   */
  async paginate<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    pageNum: number,
    pageSize: number,
  ): Promise<PaginationResult<T>> {
    const validated = this.validate(pageNum, pageSize);
    const skip = this.getSkip(validated.pageNum, validated.pageSize);

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(validated.pageSize)
      .getManyAndCount();

    return this.create(data, total, validated);
  }

  /**
   * 创建分页结果
   */
  create<T>(
    data: T[],
    total: number,
    options: PaginationOptions,
  ): PaginationResult<T> {
    const { pageNum, pageSize } = options;
    const totalPages = Math.ceil(total / pageSize);

    return {
      data,
      total,
      pageNum,
      pageSize,
      totalPages,
      hasNext: pageNum < totalPages,
      hasPrev: pageNum > 1,
    };
  }

  /**
   * 获取跳过的记录数
   */
  getSkip(pageNum: number, pageSize: number): number {
    return (pageNum - 1) * pageSize;
  }

  /**
   * 获取获取的记录数
   */
  getTake(pageSize: number): number {
    return pageSize;
  }

  /**
   * 验证并修正分页参数
   */
  validate(pageNum: number, pageSize: number): PaginationOptions {
    return {
      pageNum: Math.max(1, pageNum),
      pageSize: Math.min(Math.max(1, pageSize), 100), // 限制最大100条
    };
  }
}
