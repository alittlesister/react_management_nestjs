import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Permission } from './entities/permission.entity';
import {
  CreatePermissionDto,
  UpdatePermissionDto,
  QueryPermissionDto,
} from './dto';
import { PaginationHelper } from '../../common/helpers/pagination.helper';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    private readonly paginationHelper: PaginationHelper,
  ) {}

  /**
   * 创建权限
   */
  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    // 检查权限代码是否已存在
    const existingPermission = await this.permissionRepository.findOne({
      where: { code: createPermissionDto.code },
    });

    if (existingPermission) {
      throw new ConflictException('权限代码已存在');
    }

    const permission = this.permissionRepository.create(createPermissionDto);
    return await this.permissionRepository.save(permission);
  }

  /**
   * 查询权限列表（分页）
   */
  async findAll(queryDto: QueryPermissionDto) {
    const { pageNum, pageSize, code, name, type, parentId, isActive } =
      queryDto;

    const queryBuilder = this.permissionRepository.createQueryBuilder('permission');

    // 模糊查询权限代码
    if (code) {
      queryBuilder.andWhere('permission.code LIKE :code', {
        code: `%${code}%`,
      });
    }

    // 模糊查询权限名称
    if (name) {
      queryBuilder.andWhere('permission.name LIKE :name', {
        name: `%${name}%`,
      });
    }

    // 精确查询权限类型
    if (type) {
      queryBuilder.andWhere('permission.type = :type', { type });
    }

    // 查询父级权限
    if (parentId !== undefined) {
      queryBuilder.andWhere('permission.parentId = :parentId', { parentId });
    }

    // 查询是否启用
    if (isActive !== undefined) {
      queryBuilder.andWhere('permission.isActive = :isActive', { isActive });
    }

    // 排序
    queryBuilder.orderBy('permission.sort', 'ASC');
    queryBuilder.addOrderBy('permission.create_time', 'DESC');

    return await this.paginationHelper.paginate(
      queryBuilder,
      pageNum || 1,
      pageSize || 10,
    );
  }

  /**
   * 获取所有权限（不分页，用于树形结构）
   */
  async findAllTree(): Promise<Permission[]> {
    return await this.permissionRepository.find({
      order: { sort: 'ASC', create_time: 'DESC' },
    });
  }

  /**
   * 根据ID查询权限
   */
  async findOne(id: number): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: { id },
      relations: ['roles'],
    });

    if (!permission) {
      throw new NotFoundException(`ID为 ${id} 的权限不存在`);
    }

    return permission;
  }

  /**
   * 根据权限代码查询
   */
  async findByCode(code: string): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: { code },
    });

    if (!permission) {
      throw new NotFoundException(`权限代码 ${code} 不存在`);
    }

    return permission;
  }

  /**
   * 更新权限
   */
  async update(
    id: number,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    const permission = await this.findOne(id);

    // 如果更新权限代码，检查是否与其他权限冲突
    if (
      updatePermissionDto.code &&
      updatePermissionDto.code !== permission.code
    ) {
      const existingPermission = await this.permissionRepository.findOne({
        where: { code: updatePermissionDto.code },
      });

      if (existingPermission) {
        throw new ConflictException('权限代码已存在');
      }
    }

    Object.assign(permission, updatePermissionDto);
    return await this.permissionRepository.save(permission);
  }

  /**
   * 删除权限
   */
  async remove(id: number): Promise<void> {
    const permission = await this.findOne(id);

    // 检查是否有子权限
    const childrenCount = await this.permissionRepository.count({
      where: { parentId: id },
    });

    if (childrenCount > 0) {
      throw new ConflictException('该权限下存在子权限，无法删除');
    }

    await this.permissionRepository.remove(permission);
  }

  /**
   * 批量删除权限
   */
  async removeBatch(ids: number[]): Promise<void> {
    for (const id of ids) {
      await this.remove(id);
    }
  }
}
