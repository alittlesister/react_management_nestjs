import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../module/users/users.module';
import { AuthModule } from '../module/auth/auth.module';
import { RoleModule } from '../module/role/role.module';
import { PermissionModule } from '../module/permission/permission.module';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import injectMysql from '../plugins/mysql';
import injectRedis from '../plugins/redis';
import { CommonModule } from '../common';
import { appConfig, databaseConfig, jwtConfig, redisConfig } from '../config';

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        path.resolve(process.cwd(), 'env/.env'),
        path.resolve(process.cwd(), 'env/.env.development'),
      ],
      load: [appConfig, databaseConfig, jwtConfig, redisConfig],
    }),
    // 通用模块（全局）
    CommonModule,
    // 数据库和缓存
    injectMysql,
    injectRedis,
    // 业务模块
    UsersModule,
    AuthModule,
    RoleModule,
    PermissionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
