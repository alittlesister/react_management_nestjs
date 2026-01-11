// src/common/decorators/permissions.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';

/**
 * 权限装饰器，用于标记需要的权限
 * @param permissions 权限列表
 * @example @Permissions('user:create', 'user:update')
 */
export const Permissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
