import { Entity, Column, ManyToMany, Index } from 'typeorm';
import { BaseEntity } from '../../../common';
import { Role } from '../../role/entities/role.entity';

/**
 * 权限实体
 */
@Entity('permissions')
export class Permission extends BaseEntity {
  @Index({ unique: true })
  @Column({ length: 50, unique: true, comment: '权限代码' })
  code: string;

  @Column({ length: 50, comment: '权限名称' })
  name: string;

  @Column({ type: 'text', nullable: true, comment: '权限描述' })
  description: string;

  @Column({ length: 20, comment: '权限类型: api/menu/button' })
  type: string;

  @Column({ nullable: true, comment: '资源路径(API路径或菜单路径)' })
  resource: string;

  @Column({ nullable: true, comment: '请求方法: GET/POST/PUT/DELETE' })
  method: string;

  @Column({ type: 'int', nullable: true, comment: '父级权限ID' })
  parentId: number;

  @Column({ type: 'int', default: 0, comment: '排序' })
  sort: number;

  @Column({ default: true, comment: '是否启用' })
  isActive: boolean;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
