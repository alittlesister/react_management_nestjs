import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsInt,
  IsIn,
  MaxLength,
} from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({ description: '权限代码', example: 'user:create' })
  @IsString()
  @IsNotEmpty({ message: '权限代码不能为空' })
  @MaxLength(50, { message: '权限代码长度不能超过50' })
  code: string;

  @ApiProperty({ description: '权限名称', example: '创建用户' })
  @IsString()
  @IsNotEmpty({ message: '权限名称不能为空' })
  @MaxLength(50, { message: '权限名称长度不能超过50' })
  name: string;

  @ApiProperty({ description: '权限描述', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: '权限类型',
    example: 'api',
    enum: ['api', 'menu', 'button'],
  })
  @IsString()
  @IsIn(['api', 'menu', 'button'], { message: '权限类型必须是 api/menu/button' })
  type: string;

  @ApiProperty({
    description: '资源路径',
    example: '/api/users',
    required: false,
  })
  @IsString()
  @IsOptional()
  resource?: string;

  @ApiProperty({
    description: '请求方法',
    example: 'POST',
    enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsIn(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], {
    message: '请求方法必须是 GET/POST/PUT/DELETE/PATCH',
  })
  method?: string;

  @ApiProperty({ description: '父级权限ID', required: false })
  @IsInt()
  @IsOptional()
  parentId?: number;

  @ApiProperty({ description: '排序', default: 0, required: false })
  @IsInt()
  @IsOptional()
  sort?: number;

  @ApiProperty({ description: '是否启用', default: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
