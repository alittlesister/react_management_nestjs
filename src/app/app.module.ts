import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../module/users/users.module';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path'; // 导入 path 模块
import injectMysql from '../plugins/mysql';
import injectRedis from '../plugins/redis';

@Module({
  imports: [
    UsersModule,
    // AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        path.resolve(process.cwd(), 'env/.env'),
        path.resolve(process.cwd(), 'env/.env.development'),
      ],
    }),
    injectMysql,
    injectRedis,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
