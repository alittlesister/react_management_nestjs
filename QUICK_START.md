# 快速开始指南

## 🚀 快速启动项目

### 1. 安装依赖

```bash
npm install
# 或
pnpm install
```

### 2. 配置环境变量

创建环境配置文件：

```bash
mkdir -p env
touch env/.env
touch env/.env.development
```

在 `env/.env.development` 中添加配置：

```env
# 应用配置
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=nestjs_test

# Redis配置
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# JWT配置
JWT_SECRET=your-secret-key-change-this
JWT_EXPIRES_IN=7d
```

### 3. 启动数据库

确保 MySQL 和 Redis 已启动：

```bash
# MySQL
mysql.server start

# Redis
redis-server
```

### 4. 启动项目

```bash
# 开发模式
npm run start:dev

# 生产模式
npm run build
npm run start:prod
```

## 📝 创建新模块示例

### 使用 CLI 创建模块

```bash
nest g module module/posts
nest g controller module/posts
nest g service module/posts
```

### 手动创建完整模块

#### 1. 创建目录结构

```
src/module/posts/
├── dto/
│   ├── create-post.dto.ts
│   ├── update-post.dto.ts
│   └── query-post.dto.ts
├── entities/
│   └── post.entity.ts
├── posts.controller.ts
├── posts.service.ts
└── posts.module.ts
```

#### 2. 创建 Entity

```typescript
// src/module/posts/entities/post.entity.ts
import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common';

@Entity('posts')
export class Post extends BaseEntity {
  @Column({ comment: '标题' })
  title: string;

  @Column({ type: 'text', comment: '内容' })
  content: string;

  @Column({ comment: '作者ID' })
  authorId: number;

  @Column({ default: false, comment: '是否发布' })
  published: boolean;

  // 继承自 BaseEntity:
  // - id
  // - created_by
  // - updated_by
  // - create_time
  // - update_time
}
```

#### 3. 创建 DTO

```typescript
// src/module/posts/dto/create-post.dto.ts
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNumber()
  authorId: number;
}
```

#### 4. 创建 Service

```typescript
// src/module/posts/posts.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { PaginationHelper } from '../../common';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly paginationHelper: PaginationHelper,
  ) {}

  async create(dto: CreatePostDto) {
    const post = this.postRepository.create(dto);
    return this.postRepository.save(post);
  }

  async findAll(pageNum: number, pageSize: number) {
    const pagination = this.paginationHelper.validate(pageNum, pageSize);

    const [data, total] = await this.postRepository.findAndCount({
      skip: this.paginationHelper.getSkip(pagination.pageNum, pagination.pageSize),
      take: this.paginationHelper.getTake(pagination.pageSize),
      order: { create_time: 'DESC' },
    });

    return this.paginationHelper.create(data, total, pagination);
  }

  async findOne(id: number) {
    const post = await this.postRepository.findOne({ where: { id } });
    if (!post) {
      throw new HttpException('文章不存在', HttpStatus.NOT_FOUND);
    }
    return post;
  }

  async update(id: number, dto: Partial<CreatePostDto>) {
    const post = await this.findOne(id);
    Object.assign(post, dto);
    return this.postRepository.save(post);
  }

  async remove(id: number) {
    const post = await this.findOne(id);
    await this.postRepository.remove(post);
    return { message: '删除成功' };
  }
}
```

#### 5. 创建 Controller

```typescript
// src/module/posts/posts.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Roles } from '../../common';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @Roles('admin', 'user')
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  findAll(
    @Query('pageNum', new ParseIntPipe({ optional: true })) pageNum = 1,
    @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize = 10,
  ) {
    return this.postsService.findAll(pageNum, pageSize);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }

  @Put(':id')
  @Roles('admin')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: Partial<CreatePostDto>,
  ) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.remove(id);
  }
}
```

#### 6. 创建 Module

```typescript
// src/module/posts/posts.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
```

#### 7. 在 AppModule 中注册

```typescript
// src/app/app.module.ts
import { PostsModule } from '../module/posts/posts.module';

@Module({
  imports: [
    // ...其他模块
    PostsModule,
  ],
})
export class AppModule {}
```

## 🧪 测试 API

### 使用 curl

```bash
# 注册用户
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "testuser",
    "nickName": "测试用户",
    "password": "Test123456",
    "email": "test@example.com",
    "phone": "13812345678"
  }'

# 用户登录
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "testuser",
    "password": "Test123456"
  }'

# 获取用户列表（分页）
curl http://localhost:3000/users?pageNum=1&pageSize=10

# 获取单个用户
curl http://localhost:3000/users/1
```

### 使用 Postman/Insomnia

导入以下集合来测试 API：

```json
{
  "name": "NestJS API",
  "requests": [
    {
      "name": "用户注册",
      "method": "POST",
      "url": "http://localhost:3000/users/register",
      "headers": { "Content-Type": "application/json" },
      "body": {
        "userName": "testuser",
        "password": "Test123456",
        "email": "test@example.com"
      }
    },
    {
      "name": "用户登录",
      "method": "POST",
      "url": "http://localhost:3000/users/login",
      "headers": { "Content-Type": "application/json" },
      "body": {
        "userName": "testuser",
        "password": "Test123456"
      }
    }
  ]
}
```

## 🔧 常用命令

```bash
# 开发
npm run start:dev          # 开发模式（热重载）
npm run start:debug        # 调试模式

# 构建
npm run build             # 构建生产版本
npm run start:prod        # 运行生产版本

# 代码质量
npm run lint              # 运行 ESLint
npm run format            # 格式化代码

# 测试
npm run test              # 运行单元测试
npm run test:watch        # 监听模式运行测试
npm run test:cov          # 生成测试覆盖率
npm run test:e2e          # 运行端到端测试
```

## 📚 下一步

1. 阅读 `FRAMEWORK.md` 了解完整的框架功能
2. 阅读 `PROJECT_SETUP.md` 了解项目结构
3. 参考 `src/module/users` 模块学习最佳实践
4. 开始创建您自己的业务模块

## 💡 提示

- 所有工具类都已全局注入，直接在 Service 中依赖注入即可使用
- Entity 继承 BaseEntity 可自动获得公共字段
- Controller 使用 @Public() 装饰器可跳过JWT认证
- 使用 PaginationHelper 处理分页，保持统一的分页格式
- 使用 HttpException 抛出错误，会被全局异常过滤器统一处理

## ❓ 遇到问题？

- 检查数据库连接配置
- 确保 Redis 服务正常运行
- 查看控制台日志输出
- 参考文档和示例代码
