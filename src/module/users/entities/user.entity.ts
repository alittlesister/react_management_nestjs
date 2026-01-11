import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../common';

@Entity('users')
export class User extends BaseEntity {
  @Index({ unique: true })
  @Column({ length: 20, unique: true, comment: '用户名' })
  userName: string;

  @Column({ length: 20, nullable: true, comment: '昵称' })
  nickName: string;

  @Column({ comment: '密码' })
  password: string;

  @Column({ unique: true, nullable: true, comment: '邮箱' })
  email: string;

  @Column({ unique: true, nullable: true, comment: '手机号' })
  phone: string;

  @Column({ default: true, comment: '是否激活' })
  isActive: boolean;

  // BaseEntity 已包含以下字段：
  // - id: number
  // - created_by: string
  // - updated_by: string
  // - create_time: Date
  // - update_time: Date
}
