import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsBoolean,
  IsOptional,
  IsMobilePhone,
} from 'class-validator';
import { ValidateBy, ValidationArguments } from 'class-validator';

// 自定义验证器：确保邮箱或手机号至少有一个存在
export function IsEmailOrPhone(validationOptions?: any) {
  return ValidateBy(
    {
      name: 'isEmailOrPhone',
      validator: {
        validate: (value: unknown, args: ValidationArguments): boolean => {
          const object = args.object as Record<string, unknown>;
          const email = object.email as string | undefined;
          const phone = object.phone as string | undefined;
          // 至少有一个存在且不为空
          return Boolean(
            (email && email.trim() !== '') || (phone && phone.trim() !== ''),
          );
        },
        defaultMessage: () => '邮箱或手机号至少需要提供一个',
      },
    },
    validationOptions,
  );
}

export class CreateSysUserDto {
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  name: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  nickname: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsMobilePhone('zh-CN')
  phone?: string;

  @IsEmailOrPhone()
  emailOrPhone: string; // 虚拟字段，用于验证

  @IsBoolean()
  sysUser: true;

  @IsString()
  createdBy: string;
}

export class CreateSyncUserDto {
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  name: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  nickname: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsMobilePhone('zh-CN')
  phone?: string;

  @IsEmailOrPhone()
  emailOrPhone: string; // 虚拟字段，用于验证

  @IsBoolean()
  sysUser: false;

  @IsString()
  createdBy: string;
}
