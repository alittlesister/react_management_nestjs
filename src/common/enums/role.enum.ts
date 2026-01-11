// src/common/enums/role.enum.ts

/**
 * 角色枚举
 */
export enum Role {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

/**
 * 角色描述
 */
export const RoleDesc = {
  [Role.SUPER_ADMIN]: '超级管理员',
  [Role.ADMIN]: '管理员',
  [Role.USER]: '普通用户',
  [Role.GUEST]: '访客',
} as const;
