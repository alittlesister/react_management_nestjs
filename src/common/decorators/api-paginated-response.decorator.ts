// src/common/decorators/api-paginated-response.decorator.ts
import { applyDecorators, Type } from '@nestjs/common';

/**
 * 分页响应装饰器（用于Swagger文档）
 * @param model 数据模型
 */
export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators();
};
