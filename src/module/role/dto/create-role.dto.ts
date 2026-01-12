import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsInt,
  IsArray,
  MaxLength,
} from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ description: '角色代码', example: 'admin' })
  @IsString()
  @IsNotEmpty({ message: '角色代码不能为空' })
  @MaxLength(50, { message: '角色代码长度不能超过50' })
  code: string;

  @ApiProperty({ description: '角色名称', example: '管理员' })
  @IsString()
  @IsNotEmpty({ message: '角色名称不能为空' })
  @MaxLength(50, { message: '角色名称长度不能超过50' })
  name: string;

  @ApiProperty({ description: '角色描述', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: '排序', default: 0, required: false })
  @IsInt()
  @IsOptional()
  sort?: number;

  @ApiProperty({ description: '是否启用', default: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: '权限ID列表',
    type: [Number],
    required: false,
  })
  @IsArray()
  @IsOptional()
  permissionIds?: number[];
}
