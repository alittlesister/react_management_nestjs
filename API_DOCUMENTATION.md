# API 文档说明

## 🎉 项目已成功启动！

服务器已经成功启动，您现在可以访问以下地址查看和测试API：

### 📖 Swagger API 文档
```
http://localhost:3000/api-docs
```

## 🚀 已实现的功能模块

### 1. 认证管理模块 (Auth Module)

#### 📌 用户注册
- **接口**: `POST /auth/register`
- **描述**: 注册新用户
- **是否需要认证**: 否（公开接口）
- **请求体**:
  ```json
  {
    "userName": "testuser",
    "nickName": "测试用户",
    "password": "Test123456",
    "email": "test@example.com",
    "phone": "13812345678"
  }
  ```

#### 📌 用户登录
- **接口**: `POST /auth/login`
- **描述**: 用户登录，返回JWT令牌
- **是否需要认证**: 否（公开接口）
- **请求体**:
  ```json
  {
    "userName": "testuser",
    "password": "Test123456"
  }
  ```
- **响应示例**:
  ```json
  {
    "code": 0,
    "message": "ok",
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "tokenType": "Bearer",
      "expiresIn": 604800,
      "user": {
        "id": 1,
        "userName": "testuser",
        "nickName": "测试用户",
        "email": "test@example.com",
        "phone": "13812345678"
      }
    }
  }
  ```

#### 📌 用户登出
- **接口**: `POST /auth/logout`
- **描述**: 用户登出，清除令牌
- **是否需要认证**: 是
- **请求头**: `Authorization: Bearer <accessToken>`

#### 📌 刷新令牌
- **接口**: `POST /auth/refresh`
- **描述**: 使用刷新令牌获取新的访问令牌
- **是否需要认证**: 否（公开接口）
- **请求体**:
  ```json
  {
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

### 2. 用户管理模块 (Users Module)

#### 📌 获取用户列表
- **接口**: `GET /users`
- **描述**: 分页获取用户列表
- **是否需要认证**: 是
- **查询参数**:
  - `pageNum`: 页码（默认: 1）
  - `pageSize`: 每页数量（默认: 10，最大: 100）
- **请求头**: `Authorization: Bearer <accessToken>`

#### 📌 获取用户详情
- **接口**: `GET /users/:id`
- **描述**: 根据ID获取用户详情
- **是否需要认证**: 是
- **路径参数**: `id` - 用户ID
- **请求头**: `Authorization: Bearer <accessToken>`

#### 📌 更新用户信息
- **接口**: `PUT /users/:id`
- **描述**: 更新用户信息
- **是否需要认证**: 是
- **所需角色**: `admin`
- **路径参数**: `id` - 用户ID
- **请求头**: `Authorization: Bearer <accessToken>`
- **请求体**:
  ```json
  {
    "nickName": "新昵称",
    "email": "newemail@example.com"
  }
  ```

#### 📌 删除用户
- **接口**: `DELETE /users/:id`
- **描述**: 删除用户
- **是否需要认证**: 是
- **所需角色**: `admin`
- **路径参数**: `id` - 用户ID
- **请求头**: `Authorization: Bearer <accessToken>`

### 3. 角色管理模块 (Roles Module)

#### 📌 创建角色
- **接口**: `POST /roles`
- **描述**: 创建新角色
- **是否需要认证**: 是
- **所需角色**: `super_admin`, `admin`
- **请求头**: `Authorization: Bearer <accessToken>`
- **请求体**:
  ```json
  {
    "code": "admin",
    "name": "管理员",
    "description": "系统管理员角色",
    "sort": 0,
    "isActive": true,
    "permissionIds": [1, 2, 3]
  }
  ```

#### 📌 获取角色列表
- **接口**: `GET /roles`
- **描述**: 分页获取角色列表
- **是否需要认证**: 是
- **所需角色**: `super_admin`, `admin`
- **查询参数**:
  - `pageNum`: 页码（默认: 1）
  - `pageSize`: 每页数量（默认: 10，最大: 100）
  - `code`: 角色代码（模糊查询，可选）
  - `name`: 角色名称（模糊查询，可选）
  - `isActive`: 是否启用（可选）
- **请求头**: `Authorization: Bearer <accessToken>`

#### 📌 获取角色详情
- **接口**: `GET /roles/:id`
- **描述**: 根据ID获取角色详情，包括关联的权限和用户
- **是否需要认证**: 是
- **所需角色**: `super_admin`, `admin`
- **路径参数**: `id` - 角色ID
- **请求头**: `Authorization: Bearer <accessToken>`

#### 📌 更新角色
- **接口**: `PUT /roles/:id`
- **描述**: 更新角色信息
- **是否需要认证**: 是
- **所需角色**: `super_admin`, `admin`
- **路径参数**: `id` - 角色ID
- **请求头**: `Authorization: Bearer <accessToken>`
- **请求体**:
  ```json
  {
    "name": "新角色名称",
    "description": "新描述",
    "permissionIds": [1, 2, 3, 4]
  }
  ```

#### 📌 为角色分配权限
- **接口**: `POST /roles/:id/permissions`
- **描述**: 为指定角色分配权限
- **是否需要认证**: 是
- **所需角色**: `super_admin`, `admin`
- **路径参数**: `id` - 角色ID
- **请求头**: `Authorization: Bearer <accessToken>`
- **请求体**:
  ```json
  {
    "permissionIds": [1, 2, 3, 4, 5]
  }
  ```

#### 📌 删除角色
- **接口**: `DELETE /roles/:id`
- **描述**: 删除角色（如果有用户关联则无法删除）
- **是否需要认证**: 是
- **所需角色**: `super_admin`, `admin`
- **路径参数**: `id` - 角色ID
- **请求头**: `Authorization: Bearer <accessToken>`

### 4. 权限管理模块 (Permissions Module)

#### 📌 创建权限
- **接口**: `POST /permissions`
- **描述**: 创建新权限
- **是否需要认证**: 是
- **所需角色**: `super_admin`, `admin`
- **请求头**: `Authorization: Bearer <accessToken>`
- **请求体**:
  ```json
  {
    "code": "user:create",
    "name": "创建用户",
    "description": "创建新用户的权限",
    "type": "api",
    "resource": "/api/users",
    "method": "POST",
    "parentId": 0,
    "sort": 0,
    "isActive": true
  }
  ```

#### 📌 获取权限列表
- **接口**: `GET /permissions`
- **描述**: 分页获取权限列表
- **是否需要认证**: 是
- **所需角色**: `super_admin`, `admin`
- **查询参数**:
  - `pageNum`: 页码（默认: 1）
  - `pageSize`: 每页数量（默认: 10，最大: 100）
  - `code`: 权限代码（模糊查询，可选）
  - `name`: 权限名称（模糊查询，可选）
  - `type`: 权限类型（api/menu/button，可选）
  - `parentId`: 父级权限ID（可选）
  - `isActive`: 是否启用（可选）
- **请求头**: `Authorization: Bearer <accessToken>`

#### 📌 获取权限树
- **接口**: `GET /permissions/tree`
- **描述**: 获取所有权限的树形结构（不分页）
- **是否需要认证**: 是
- **所需角色**: `super_admin`, `admin`
- **请求头**: `Authorization: Bearer <accessToken>`

#### 📌 获取权限详情
- **接口**: `GET /permissions/:id`
- **描述**: 根据ID获取权限详情，包括关联的角色
- **是否需要认证**: 是
- **所需角色**: `super_admin`, `admin`
- **路径参数**: `id` - 权限ID
- **请求头**: `Authorization: Bearer <accessToken>`

#### 📌 更新权限
- **接口**: `PUT /permissions/:id`
- **描述**: 更新权限信息
- **是否需要认证**: 是
- **所需角色**: `super_admin`, `admin`
- **路径参数**: `id` - 权限ID
- **请求头**: `Authorization: Bearer <accessToken>`
- **请求体**:
  ```json
  {
    "name": "新权限名称",
    "description": "新描述",
    "isActive": true
  }
  ```

#### 📌 删除权限
- **接口**: `DELETE /permissions/:id`
- **描述**: 删除权限（如果有子权限则无法删除）
- **是否需要认证**: 是
- **所需角色**: `super_admin`, `admin`
- **路径参数**: `id` - 权限ID
- **请求头**: `Authorization: Bearer <accessToken>`

## 🔐 认证说明

### JWT 认证流程

1. **用户注册**: 调用 `/auth/register` 创建账号
2. **用户登录**: 调用 `/auth/login` 获取JWT令牌
3. **使用令牌**: 在需要认证的接口请求头中添加：
   ```
   Authorization: Bearer <your_access_token>
   ```
4. **令牌刷新**: 当访问令牌过期时，使用刷新令牌调用 `/auth/refresh`
5. **用户登出**: 调用 `/auth/logout` 清除令牌

### Swagger 中使用认证

1. 访问 http://localhost:3000/api-docs
2. 点击页面右上角的 `Authorize` 按钮
3. 在弹出框中输入: `Bearer <your_access_token>`
4. 点击 `Authorize` 按钮
5. 现在所有需要认证的接口都会自动携带令牌

## 📝 测试步骤

### 1. 使用 Swagger UI 测试

1. 打开浏览器访问: `http://localhost:3000/api-docs`

2. **注册用户**:
   - 找到 `认证管理` -> `POST /auth/register`
   - 点击 `Try it out`
   - 输入用户信息
   - 点击 `Execute`

3. **登录获取令牌**:
   - 找到 `认证管理` -> `POST /auth/login`
   - 点击 `Try it out`
   - 输入用户名和密码
   - 点击 `Execute`
   - 复制返回的 `accessToken`

4. **设置认证**:
   - 点击页面右上角 `Authorize` 按钮
   - 输入: `Bearer <复制的accessToken>`
   - 点击 `Authorize`

5. **测试其他接口**:
   - 现在可以测试所有需要认证的接口了

### 2. 使用 cURL 测试

```bash
# 注册用户
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "testuser",
    "nickName": "测试用户",
    "password": "Test123456",
    "email": "test@example.com",
    "phone": "13812345678"
  }'

# 登录
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "testuser",
    "password": "Test123456"
  }'

# 获取用户列表（需要替换 <TOKEN> 为实际的token）
curl -X GET http://localhost:3000/users?pageNum=1&pageSize=10 \
  -H "Authorization: Bearer <TOKEN>"

# 获取用户详情
curl -X GET http://localhost:3000/users/1 \
  -H "Authorization: Bearer <TOKEN>"
```

### 3. 使用 Postman 测试

1. 导入 API 到 Postman
2. 创建环境变量:
   - `baseUrl`: `http://localhost:3000`
   - `accessToken`: 登录后获取的令牌
3. 在请求的 Authorization 中选择 `Bearer Token`，使用 `{{accessToken}}`

## 🛠️ 技术栈

- **框架**: NestJS 11.x
- **数据库**: MySQL + TypeORM
- **缓存**: Redis
- **认证**: JWT + Passport
- **文档**: Swagger/OpenAPI 3.0
- **验证**: class-validator + class-transformer

## 📊 统一响应格式

所有接口返回的数据格式统一为：

```json
{
  "code": 0,        // 0表示成功，其他值表示错误
  "message": "ok",  // 响应消息
  "data": {}        // 响应数据
}
```

### 分页数据格式

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "data": [],           // 数据列表
    "total": 100,         // 总记录数
    "pageNum": 1,         // 当前页码
    "pageSize": 10,       // 每页数量
    "totalPages": 10,     // 总页数
    "hasNext": true,      // 是否有下一页
    "hasPrev": false      // 是否有上一页
  }
}
```

## ❗ 常见错误码

- `0`: 成功
- `400`: 请求参数错误
- `401`: 未授权（未登录或令牌无效）
- `403`: 无权限访问
- `404`: 资源不存在
- `422`: 数据验证失败
- `500`: 服务器内部错误

## 🔧 环境配置

确保 `env/.env.development` 文件包含以下配置：

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
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRES_IN=30d
```

## 📱 下一步计划

可以继续添加的功能：
- [x] 权限管理模块（角色、权限、菜单）
- [ ] 文件上传功能
- [ ] 日志管理
- [ ] 操作审计
- [ ] 数据字典
- [ ] 系统配置

## 💡 提示

1. **令牌有效期**:
   - 访问令牌: 7天
   - 刷新令牌: 30天

2. **密码要求**:
   - 最少8位
   - 最多20位

3. **用户名要求**:
   - 最少6位
   - 最多20位

4. **分页限制**:
   - 最大每页100条记录

## 🎯 快速开始

```bash
# 1. 启动数据库和Redis
# MySQL: localhost:3306
# Redis: localhost:6379

# 2. 配置环境变量
# 编辑 env/.env.development

# 3. 启动项目
npm run start:dev

# 4. 访问Swagger文档
# http://localhost:3000/api-docs
```

---

**祝您使用愉快！** 🎉

如有问题，请查看项目文档或联系开发团队。
