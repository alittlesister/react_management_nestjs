import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt } from 'class-validator';

export class AssignPermissionsDto {
  @ApiProperty({
    description: '权限ID列表',
    type: [Number],
    example: [1, 2, 3],
  })
  @IsArray()
  @IsInt({ each: true })
  permissionIds: number[];
}
