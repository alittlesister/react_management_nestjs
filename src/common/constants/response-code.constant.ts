// src/common/constants/response-code.constant.ts

/**
 * 响应状态码
 */
export const ResponseCode = {
  SUCCESS: 0,
  ERROR: 1,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
  BAD_REQUEST: 400,
  VALIDATION_ERROR: 422,
} as const;

/**
 * 响应消息
 */
export const ResponseMessage = {
  SUCCESS: '操作成功',
  ERROR: '操作失败',
  UNAUTHORIZED: '未授权，请先登录',
  FORBIDDEN: '无权限访问',
  NOT_FOUND: '资源不存在',
  INTERNAL_ERROR: '服务器内部错误',
  BAD_REQUEST: '请求参数错误',
  VALIDATION_ERROR: '数据验证失败',
} as const;
