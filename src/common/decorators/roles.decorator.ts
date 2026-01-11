// src/common/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * 角色装饰器，用于标记需要的角色
 * @param roles 角色列表
 * @example @Roles('admin', 'user')
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
