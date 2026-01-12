// src/module/auth/dto/login-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ description: 'JWT访问令牌' })
  accessToken: string;

  @ApiProperty({ description: '刷新令牌' })
  refreshToken: string;

  @ApiProperty({ description: '令牌类型', example: 'Bearer' })
  tokenType: string;

  @ApiProperty({ description: '过期时间（秒）', example: 604800 })
  expiresIn: number;

  @ApiProperty({ description: '用户信息' })
  user: {
    id: number;
    userName: string;
    nickName: string;
    email: string;
    phone: string;
  };
}
