import { Entity, Column, ManyToMany, JoinTable, Index } from 'typeorm';
import { BaseEntity } from '../../../common';
import { Permission } from '../../permission/entities/permission.entity';
import { User } from '../../users/entities/user.entity';

/**
 * 角色实体
 */
@Entity('roles')
export class Role extends BaseEntity {
  @Index({ unique: true })
  @Column({ length: 50, unique: true, comment: '角色代码' })
  code: string;

  @Column({ length: 50, comment: '角色名称' })
  name: string;

  @Column({ type: 'text', nullable: true, comment: '角色描述' })
  description: string;

  @Column({ type: 'int', default: 0, comment: '排序' })
  sort: number;

  @Column({ default: true, comment: '是否启用' })
  isActive: boolean;

  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable({
    name: 'role_permissions',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions: Permission[];

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
