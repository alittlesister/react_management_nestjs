// src/common/helpers/query-builder.helper.ts
import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder, Brackets, ObjectLiteral } from 'typeorm';

export interface QueryOptions {
  search?: string;
  searchFields?: string[];
  filters?: Record<string, any>;
  sort?: string;
  order?: 'ASC' | 'DESC';
}

@Injectable()
export class QueryBuilderHelper {
  /**
   * 构建查询
   */
  build<T extends ObjectLiteral>(
    repository: Repository<T>,
    alias: string,
    options: QueryOptions = {},
  ): SelectQueryBuilder<T> {
    const queryBuilder = repository.createQueryBuilder(alias);

    // 搜索
    if (options.search && options.searchFields?.length) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          options.searchFields!.forEach((field, index) => {
            const condition = `${alias}.${field} LIKE :search`;
            if (index === 0) {
              qb.where(condition, { search: `%${options.search}%` });
            } else {
              qb.orWhere(condition, { search: `%${options.search}%` });
            }
          });
        }),
      );
    }

    // 过滤
    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            queryBuilder.andWhere(`${alias}.${key} IN (:...${key})`, {
              [key]: value,
            });
          } else {
            queryBuilder.andWhere(`${alias}.${key} = :${key}`, { [key]: value });
          }
        }
      });
    }

    // 排序
    if (options.sort) {
      const order = options.order || 'DESC';
      queryBuilder.orderBy(`${alias}.${options.sort}`, order);
    } else {
      queryBuilder.orderBy(`${alias}.create_time`, 'DESC');
    }

    return queryBuilder;
  }

  /**
   * 添加日期范围查询
   */
  addDateRange<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    alias: string,
    field: string,
    startDate?: Date,
    endDate?: Date,
  ): SelectQueryBuilder<T> {
    if (startDate) {
      queryBuilder.andWhere(`${alias}.${field} >= :startDate`, { startDate });
    }
    if (endDate) {
      queryBuilder.andWhere(`${alias}.${field} <= :endDate`, { endDate });
    }
    return queryBuilder;
  }

  /**
   * 添加关系查询
   */
  addRelation<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    alias: string,
    relation: string,
    relationAlias: string,
  ): SelectQueryBuilder<T> {
    return queryBuilder.leftJoinAndSelect(
      `${alias}.${relation}`,
      relationAlias,
    );
  }

  /**
   * 添加分页
   */
  addPagination<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    pageNum: number,
    pageSize: number,
  ): SelectQueryBuilder<T> {
    return queryBuilder.skip((pageNum - 1) * pageSize).take(pageSize);
  }
}
