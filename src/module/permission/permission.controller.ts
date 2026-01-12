import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { PermissionService } from './permission.service';
import {
  CreatePermissionDto,
  UpdatePermissionDto,
  QueryPermissionDto,
} from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@ApiTags('权限管理')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: '创建权限' })
  @ApiResponse({ status: 201, description: '创建成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 409, description: '权限代码已存在' })
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    return await this.permissionService.create(createPermissionDto);
  }

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: '获取权限列表（分页）' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async findAll(@Query() queryDto: QueryPermissionDto) {
    return await this.permissionService.findAll(queryDto);
  }

  @Get('tree')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: '获取权限树（不分页）' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async findAllTree() {
    return await this.permissionService.findAllTree();
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: '获取权限详情' })
  @ApiParam({ name: 'id', description: '权限ID' })
  @ApiResponse({ status: 200, description: '查询成功' })
  @ApiResponse({ status: 404, description: '权限不存在' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.permissionService.findOne(id);
  }

  @Put(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: '更新权限' })
  @ApiParam({ name: 'id', description: '权限ID' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '权限不存在' })
  @ApiResponse({ status: 409, description: '权限代码已存在' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return await this.permissionService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: '删除权限' })
  @ApiParam({ name: 'id', description: '权限ID' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '权限不存在' })
  @ApiResponse({ status: 409, description: '该权限下存在子权限，无法删除' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.permissionService.remove(id);
    return { message: '删除成功' };
  }
}
