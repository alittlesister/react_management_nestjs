import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryPermissionDto {
  @ApiProperty({ description: '页码', required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageNum?: number = 1;

  @ApiProperty({
    description: '每页数量',
    required: false,
    default: 10,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 10;

  @ApiProperty({ description: '权限代码（模糊查询）', required: false })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ description: '权限名称（模糊查询）', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: '权限类型', required: false })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({ description: '父级权限ID', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  parentId?: number;

  @ApiProperty({ description: '是否启用', required: false })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;
}
