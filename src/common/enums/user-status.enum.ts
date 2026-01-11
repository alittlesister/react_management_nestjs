// src/common/enums/user-status.enum.ts

/**
 * 用户状态枚举
 */
export enum UserStatus {
  INACTIVE = 0,
  ACTIVE = 1,
  FROZEN = 2,
  DELETED = 3,
}

/**
 * 用户状态描述
 */
export const UserStatusDesc = {
  [UserStatus.INACTIVE]: '未激活',
  [UserStatus.ACTIVE]: '正常',
  [UserStatus.FROZEN]: '冻结',
  [UserStatus.DELETED]: '已删除',
} as const;
