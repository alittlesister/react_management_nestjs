import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Role } from './entities/role.entity';
import { Permission } from '../permission/entities/permission.entity';
import {
  CreateRoleDto,
  UpdateRoleDto,
  QueryRoleDto,
  AssignPermissionsDto,
} from './dto';
import { PaginationHelper } from '../../common/helpers/pagination.helper';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    private readonly paginationHelper: PaginationHelper,
  ) {}

  /**
   * 创建角色
   */
  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    // 检查角色代码是否已存在
    const existingRole = await this.roleRepository.findOne({
      where: { code: createRoleDto.code },
    });

    if (existingRole) {
      throw new ConflictException('角色代码已存在');
    }

    const { permissionIds, ...roleData } = createRoleDto;

    const role = this.roleRepository.create(roleData);

    // 如果指定了权限，关联权限
    if (permissionIds && permissionIds.length > 0) {
      const permissions = await this.permissionRepository.findBy({
        id: In(permissionIds),
      });
      role.permissions = permissions;
    }

    return await this.roleRepository.save(role);
  }

  /**
   * 查询角色列表（分页）
   */
  async findAll(queryDto: QueryRoleDto) {
    const { pageNum, pageSize, code, name, isActive } = queryDto;

    const queryBuilder = this.roleRepository.createQueryBuilder('role');

    // 模糊查询角色代码
    if (code) {
      queryBuilder.andWhere('role.code LIKE :code', { code: `%${code}%` });
    }

    // 模糊查询角色名称
    if (name) {
      queryBuilder.andWhere('role.name LIKE :name', { name: `%${name}%` });
    }

    // 查询是否启用
    if (isActive !== undefined) {
      queryBuilder.andWhere('role.isActive = :isActive', { isActive });
    }

    // 排序
    queryBuilder.orderBy('role.sort', 'ASC');
    queryBuilder.addOrderBy('role.create_time', 'DESC');

    return await this.paginationHelper.paginate(
      queryBuilder,
      pageNum || 1,
      pageSize || 10,
    );
  }

  /**
   * 根据ID查询角色
   */
  async findOne(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions', 'users'],
    });

    if (!role) {
      throw new NotFoundException(`ID为 ${id} 的角色不存在`);
    }

    return role;
  }

  /**
   * 根据角色代码查询
   */
  async findByCode(code: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { code },
      relations: ['permissions'],
    });

    if (!role) {
      throw new NotFoundException(`角色代码 ${code} 不存在`);
    }

    return role;
  }

  /**
   * 更新角色
   */
  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);

    // 如果更新角色代码，检查是否与其他角色冲突
    if (updateRoleDto.code && updateRoleDto.code !== role.code) {
      const existingRole = await this.roleRepository.findOne({
        where: { code: updateRoleDto.code },
      });

      if (existingRole) {
        throw new ConflictException('角色代码已存在');
      }
    }

    const { permissionIds, ...roleData } = updateRoleDto;

    Object.assign(role, roleData);

    // 如果指定了权限，更新权限关联
    if (permissionIds !== undefined) {
      if (permissionIds.length > 0) {
        const permissions = await this.permissionRepository.findBy({
          id: In(permissionIds),
        });
        role.permissions = permissions;
      } else {
        role.permissions = [];
      }
    }

    return await this.roleRepository.save(role);
  }

  /**
   * 为角色分配权限
   */
  async assignPermissions(
    id: number,
    assignPermissionsDto: AssignPermissionsDto,
  ): Promise<Role> {
    const role = await this.findOne(id);

    const { permissionIds } = assignPermissionsDto;

    if (permissionIds.length > 0) {
      const permissions = await this.permissionRepository.findBy({
        id: In(permissionIds),
      });

      if (permissions.length !== permissionIds.length) {
        throw new NotFoundException('部分权限ID不存在');
      }

      role.permissions = permissions;
    } else {
      role.permissions = [];
    }

    return await this.roleRepository.save(role);
  }

  /**
   * 删除角色
   */
  async remove(id: number): Promise<void> {
    const role = await this.findOne(id);

    // 检查是否有用户正在使用该角色
    if (role.users && role.users.length > 0) {
      throw new ConflictException('该角色下存在用户，无法删除');
    }

    await this.roleRepository.remove(role);
  }

  /**
   * 批量删除角色
   */
  async removeBatch(ids: number[]): Promise<void> {
    for (const id of ids) {
      await this.remove(id);
    }
  }
}
