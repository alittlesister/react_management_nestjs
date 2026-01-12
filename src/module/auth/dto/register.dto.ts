// src/module/auth/dto/register.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEmail,
  IsMobilePhone,
  IsOptional,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: '用户名', example: 'testuser', minLength: 6, maxLength: 20 })
  @IsString()
  @IsNotEmpty({ message: '用户名不能为空' })
  @MinLength(6, { message: '用户名长度不能少于6位' })
  @MaxLength(20, { message: '用户名长度不能超过20位' })
  userName: string;

  @ApiProperty({ description: '昵称', example: '测试用户', required: false })
  @IsString()
  @IsOptional()
  @MinLength(2, { message: '昵称长度不能少于2位' })
  @MaxLength(20, { message: '昵称长度不能超过20位' })
  nickName?: string;

  @ApiProperty({ description: '密码', example: 'Test123456', minLength: 8, maxLength: 20 })
  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(8, { message: '密码长度不能少于8位' })
  @MaxLength(20, { message: '密码长度不能超过20位' })
  password: string;

  @ApiProperty({ description: '邮箱', example: 'test@example.com' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  email: string;

  @ApiProperty({ description: '手机号', example: '13812345678' })
  @IsMobilePhone('zh-CN', {}, { message: '手机号格式不正确' })
  @IsNotEmpty({ message: '手机号不能为空' })
  phone: string;
}
