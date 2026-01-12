// src/module/auth/auth.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  /**
   * 用户注册
   */
  async register(dto: RegisterDto) {
    return this.usersService.register(dto);
  }

  /**
   * 用户登录
   */
  async login(dto: LoginDto): Promise<LoginResponseDto> {
    // 验证用户
    const user = await this.usersService.login(dto.userName, dto.password);

    // 生成令牌
    const payload = {
      sub: user.id,
      userName: user.userName,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.refreshSecret'),
      expiresIn: this.configService.get<string>('jwt.refreshExpiresIn'),
    });

    // 保存刷新令牌到Redis
    await this.redis.setex(
      `refresh_token:${user.id}`,
      30 * 24 * 60 * 60, // 30天
      refreshToken,
    );

    // 保存访问令牌到Redis（用于登出）
    const expiresIn = 7 * 24 * 60 * 60; // 7天
    await this.redis.setex(
      `access_token:${user.id}`,
      expiresIn,
      accessToken,
    );

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn,
      user: {
        id: user.id,
        userName: user.userName,
        nickName: user.nickName,
        email: user.email,
        phone: user.phone,
      },
    };
  }

  /**
   * 用户登出
   */
  async logout(userId: number) {
    // 删除Redis中的令牌
    await this.redis.del(`access_token:${userId}`);
    await this.redis.del(`refresh_token:${userId}`);

    return { message: '登出成功' };
  }

  /**
   * 刷新令牌
   */
  async refreshToken(refreshToken: string) {
    try {
      // 验证刷新令牌
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
      });

      // 检查Redis中的刷新令牌
      const storedToken = await this.redis.get(`refresh_token:${payload.sub}`);
      if (!storedToken || storedToken !== refreshToken) {
        throw new HttpException('刷新令牌无效', HttpStatus.UNAUTHORIZED);
      }

      // 生成新的访问令牌
      const newPayload = {
        sub: payload.sub,
        userName: payload.userName,
        email: payload.email,
      };

      const accessToken = this.jwtService.sign(newPayload);

      // 更新Redis中的访问令牌
      const expiresIn = 7 * 24 * 60 * 60; // 7天
      await this.redis.setex(
        `access_token:${payload.sub}`,
        expiresIn,
        accessToken,
      );

      return {
        accessToken,
        tokenType: 'Bearer',
        expiresIn,
      };
    } catch (error) {
      throw new HttpException('刷新令牌无效', HttpStatus.UNAUTHORIZED);
    }
  }

  /**
   * 验证用户
   */
  async validateUser(userId: number) {
    return this.usersService.findOne(userId);
  }
}
