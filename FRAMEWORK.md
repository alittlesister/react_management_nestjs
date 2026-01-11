# NestJS 项目框架说明

## 📁 项目结构

```
src/
├── common/                    # 通用模块
│   ├── constants/            # 常量定义
│   ├── decorators/           # 装饰器
│   ├── entities/             # 基础实体类
│   ├── enums/                # 枚举
│   ├── filters/              # 异常过滤器
│   ├── guards/               # 守卫
│   ├── helpers/              # 业务工具类
│   ├── interceptors/         # 拦截器
│   ├── middleware/           # 中间件
│   ├── pipes/                # 管道
│   ├── utils/                # 通用工具类
│   ├── common.module.ts      # 通用模块
│   └── index.ts              # 统一导出
├── config/                    # 配置模块
│   ├── app.config.ts         # 应用配置
│   ├── database.config.ts    # 数据库配置
│   ├── jwt.config.ts         # JWT配置
│   ├── redis.config.ts       # Redis配置
│   └── index.ts              # 统一导出
├── module/                    # 业务模块
│   └── users/                # 用户模块示例
└── plugins/                   # 插件配置
```

## 🛠️ 工具库使用

### 1. Utils（通用工具类）

#### DateUtil - 日期时间工具
```typescript
import { DateUtil } from '@/common';

// 注入使用
constructor(private readonly dateUtil: DateUtil) {}

// 格式化日期
const formatted = this.dateUtil.format(new Date(), 'YYYY-MM-DD HH:mm:ss');

// 获取时间戳
const timestamp = this.dateUtil.timestamp();

// 日期加减
const tomorrow = this.dateUtil.add(new Date(), 1, 'day');
```

#### CryptoUtil - 加密工具
```typescript
import { CryptoUtil } from '@/common';

constructor(private readonly cryptoUtil: CryptoUtil) {}

// MD5加密
const md5Hash = this.cryptoUtil.md5('password');

// 生成UUID
const uuid = this.cryptoUtil.uuid();

// AES加密/解密
const encrypted = this.cryptoUtil.aesEncrypt('data', 'secret-key');
const decrypted = this.cryptoUtil.aesDecrypt(encrypted, 'secret-key');
```

#### StringUtil - 字符串工具
```typescript
import { StringUtil } from '@/common';

constructor(private readonly stringUtil: StringUtil) {}

// 驼峰转下划线
const snake = this.stringUtil.camelToSnake('userName'); // user_name

// 手机号脱敏
const masked = this.stringUtil.maskPhone('13812345678'); // 138****5678
```

#### ValidationUtil - 验证工具
```typescript
import { ValidationUtil } from '@/common';

constructor(private readonly validationUtil: ValidationUtil) {}

// 验证手机号
const isValid = this.validationUtil.isPhone('13812345678');

// 验证邮箱
const isEmail = this.validationUtil.isEmail('test@example.com');
```

### 2. Helpers（业务工具类）

#### PaginationHelper - 分页工具
```typescript
import { PaginationHelper } from '@/common';

constructor(private readonly paginationHelper: PaginationHelper) {}

async findAll(pageNum: number, pageSize: number) {
  const [data, total] = await this.repository.findAndCount({
    skip: this.paginationHelper.getSkip(pageNum, pageSize),
    take: this.paginationHelper.getTake(pageSize),
  });

  return this.paginationHelper.create(data, total, { pageNum, pageSize });
}
```

#### QueryBuilderHelper - 查询构造器
```typescript
import { QueryBuilderHelper } from '@/common';

constructor(private readonly queryBuilder: QueryBuilderHelper) {}

async search(keyword: string) {
  const qb = this.queryBuilder.build(
    this.repository,
    'user',
    {
      search: keyword,
      searchFields: ['userName', 'nickName', 'email'],
      filters: { isActive: true },
      sort: 'create_time',
      order: 'DESC',
    }
  );

  return qb.getMany();
}
```

#### TreeHelper - 树形结构工具
```typescript
import { TreeHelper } from '@/common';

constructor(private readonly treeHelper: TreeHelper) {}

// 数组转树
const tree = this.treeHelper.arrayToTree(flatArray);

// 树转数组
const array = this.treeHelper.treeToArray(tree);

// 查找节点
const node = this.treeHelper.findNode(tree, (n) => n.id === 1);
```

## 🎨 装饰器使用

### @Public() - 公开接口
```typescript
import { Public } from '@/common';

@Controller('auth')
export class AuthController {
  @Public()  // 该接口跳过JWT认证
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
```

### @CurrentUser() - 获取当前用户
```typescript
import { CurrentUser } from '@/common';

@Get('profile')
async getProfile(@CurrentUser() user: User) {
  return user;
}

// 获取用户的某个属性
@Get('username')
async getUsername(@CurrentUser('userName') userName: string) {
  return userName;
}
```

### @Roles() - 角色验证
```typescript
import { Roles, RolesGuard } from '@/common';

@Controller('admin')
@UseGuards(RolesGuard)
export class AdminController {
  @Roles('admin', 'super_admin')
  @Get('users')
  async getUsers() {
    return this.userService.findAll();
  }
}
```

### @Permissions() - 权限验证
```typescript
import { Permissions, PermissionsGuard } from '@/common';

@UseGuards(PermissionsGuard)
@Controller('users')
export class UsersController {
  @Permissions('user:create')
  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }
}
```

### @Ip() 和 @UserAgent() - 获取请求信息
```typescript
import { Ip, UserAgent } from '@/common';

@Post('login')
async login(
  @Body() dto: LoginDto,
  @Ip() ip: string,
  @UserAgent() userAgent: string,
) {
  console.log('登录IP:', ip);
  console.log('User-Agent:', userAgent);
  return this.authService.login(dto);
}
```

## 🛡️ 守卫使用

### JwtAuthGuard - JWT认证守卫
```typescript
import { JwtAuthGuard } from '@/common';

// 全局使用（在 main.ts 中）
app.useGlobalGuards(new JwtAuthGuard(new Reflector()));

// 单个控制器使用
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {}
```

### ThrottleGuard - 限流守卫
```typescript
import { ThrottleGuard } from '@/common';

@UseGuards(new ThrottleGuard(60000, 10)) // 60秒内最多10次请求
@Post('send-code')
async sendCode(@Body() dto: SendCodeDto) {
  return this.smsService.sendCode(dto.phone);
}
```

## 🔄 拦截器使用

### TransformInterceptor - 响应转换
```typescript
// 在 main.ts 中全局使用
import { TransformInterceptor } from '@/common';

app.useGlobalInterceptors(new TransformInterceptor(new Reflector()));

// 跳过响应转换
import { SkipTransform } from '@/common';

@SkipTransform()
@Get('download')
async download() {
  return streamFile;
}
```

### LoggingInterceptor - 日志拦截器
```typescript
// 在 main.ts 中全局使用
import { LoggingInterceptor } from '@/common';

app.useGlobalInterceptors(new LoggingInterceptor());
```

### CacheInterceptor - 缓存拦截器
```typescript
import { CacheInterceptor, CacheKey, CacheTTL } from '@/common';

@UseInterceptors(CacheInterceptor)
@Controller('products')
export class ProductsController {
  @CacheKey('products:list')
  @CacheTTL(60000) // 缓存60秒
  @Get()
  async findAll() {
    return this.productsService.findAll();
  }
}
```

## 🚰 管道使用

### ParsePaginationPipe - 分页参数解析
```typescript
import { ParsePaginationPipe, PaginationOptions } from '@/common';

@Get()
async findAll(@Query(ParsePaginationPipe) pagination: PaginationOptions) {
  return this.userService.findAll(pagination.pageNum, pagination.pageSize);
}
```

### TrimPipe - 去除空格
```typescript
import { TrimPipe } from '@/common';

// 全局使用
app.useGlobalPipes(new TrimPipe());

// 单个路由使用
@Post()
async create(@Body(TrimPipe) dto: CreateUserDto) {
  return this.userService.create(dto);
}
```

## 📊 基础实体类使用

```typescript
import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@/common';

@Entity('users')
export class User extends BaseEntity {
  @Column()
  userName: string;

  @Column()
  email: string;

  // BaseEntity 已包含以下字段：
  // - id: number
  // - created_by: string
  // - updated_by: string
  // - create_time: Date
  // - update_time: Date
}
```

## ⚙️ 配置使用

```typescript
import { ConfigService } from '@nestjs/config';

constructor(private configService: ConfigService) {}

// 获取应用配置
const port = this.configService.get<number>('app.port');

// 获取数据库配置
const dbHost = this.configService.get<string>('database.host');

// 获取JWT配置
const jwtSecret = this.configService.get<string>('jwt.secret');

// 获取Redis配置
const redisHost = this.configService.get<string>('redis.host');
```

## 📝 常量和枚举使用

```typescript
import { ResponseCode, UserStatus, Role } from '@/common';

// 使用响应状态码
return {
  code: ResponseCode.SUCCESS,
  message: '操作成功',
  data: user,
};

// 使用用户状态枚举
user.status = UserStatus.ACTIVE;

// 使用角色枚举
user.role = Role.ADMIN;
```

## 🚀 在 AppModule 中引入 CommonModule

```typescript
import { Module } from '@nestjs/common';
import { CommonModule } from './common';
import { ConfigModule } from '@nestjs/config';
import { appConfig, databaseConfig, jwtConfig, redisConfig } from './config';

@Module({
  imports: [
    CommonModule,  // 引入通用模块
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig, redisConfig],
    }),
    // 其他模块...
  ],
})
export class AppModule {}
```

## 💡 最佳实践

1. **全局配置**: 在 `main.ts` 中配置全局拦截器、过滤器、管道
2. **依赖注入**: 优先使用依赖注入方式使用工具类
3. **类型安全**: 充分利用 TypeScript 的类型系统
4. **统一响应**: 使用 `TransformInterceptor` 统一响应格式
5. **异常处理**: 使用 `AllExceptionFilter` 统一异常处理
6. **分层架构**: Controller -> Service -> Repository

## 📚 示例项目

参考 `src/module/users` 目录查看完整的使用示例。
