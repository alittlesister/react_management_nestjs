// src/common/helpers/response.helper.ts
import { Injectable } from '@nestjs/common';

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

@Injectable()
export class ResponseHelper {
  /**
   * 成功响应
   */
  success<T>(data: T, message = 'ok'): ApiResponse<T> {
    return {
      code: 0,
      message,
      data,
    };
  }

  /**
   * 失败响应
   */
  error(message: string, code = 1): ApiResponse<null> {
    return {
      code,
      message,
      data: null,
    };
  }

  /**
   * 分页响应
   */
  paginated<T>(
    data: T[],
    total: number,
    pageNum: number,
    pageSize: number,
  ): ApiResponse<{
    data: T[];
    total: number;
    pageNum: number;
    pageSize: number;
    totalPages: number;
  }> {
    return this.success({
      data,
      total,
      pageNum,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  }

  /**
   * 列表响应
   */
  list<T>(data: T[], total?: number): ApiResponse<{ data: T[]; total?: number }> {
    return this.success({
      data,
      ...(total !== undefined && { total }),
    });
  }

  /**
   * 创建成功响应
   */
  created<T>(data: T): ApiResponse<T> {
    return this.success(data, '创建成功');
  }

  /**
   * 更新成功响应
   */
  updated<T>(data: T): ApiResponse<T> {
    return this.success(data, '更新成功');
  }

  /**
   * 删除成功响应
   */
  deleted(): ApiResponse<null> {
    return this.success(null, '删除成功');
  }

  /**
   * 无内容响应
   */
  noContent(): ApiResponse<null> {
    return this.success(null, '操作成功');
  }
}
