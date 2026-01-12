import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  TransformInterceptor,
  LoggingInterceptor,
  AllExceptionFilter,
  TrimPipe,
} from './common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 获取配置服务
  const configService = app.get(ConfigService);

  // CORS配置
  app.enableCors({
    origin: configService.get<string>('app.corsOrigin') || 'http://localhost:5173',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });

  // 全局管道
  app.useGlobalPipes(
    new TrimPipe(), // 去除空格
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 全局拦截器
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(
    new LoggingInterceptor(), // 日志拦截器
    new TransformInterceptor(reflector), // 响应转换拦截器
  );

  // 全局过滤器
  app.useGlobalFilters(new AllExceptionFilter());

  // Swagger配置
  const config = new DocumentBuilder()
    .setTitle('NestJS API 文档')
    .setDescription('NestJS项目API接口文档')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: '输入JWT令牌',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('认证管理', '用户认证相关接口')
    .addTag('用户管理', '用户信息管理接口')
    .addTag('权限管理', '权限和角色管理接口')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // 保持授权状态
    },
    customSiteTitle: 'NestJS API 文档',
  });

  // 启动服务
  const port = configService.get<number>('app.port') || 3000;
  const env = configService.get<string>('app.env') || 'development';

  await app.listen(port);

  Logger.log(`🚀 Server is running on http://localhost:${port}`);
  Logger.log(`📖 API Documentation: http://localhost:${port}/api-docs`);
  Logger.log(`📝 Environment: ${env}`);
  Logger.log(`🌍 CORS enabled for: ${configService.get<string>('app.corsOrigin')}`);
}

void bootstrap();
