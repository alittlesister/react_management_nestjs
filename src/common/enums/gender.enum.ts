// src/common/enums/gender.enum.ts

/**
 * 性别枚举
 */
export enum Gender {
  UNKNOWN = 0,
  MALE = 1,
  FEMALE = 2,
}

/**
 * 性别描述
 */
export const GenderDesc = {
  [Gender.UNKNOWN]: '未知',
  [Gender.MALE]: '男',
  [Gender.FEMALE]: '女',
} as const;
