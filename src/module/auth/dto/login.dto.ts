// src/module/auth/dto/login.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: '用户名', example: 'testuser' })
  @IsString()
  @IsNotEmpty({ message: '用户名不能为空' })
  userName: string;

  @ApiProperty({ description: '密码', example: 'Test123456' })
  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
}
