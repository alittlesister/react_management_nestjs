import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Check,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity('fd_user')
@Check(
  'email_or_phone_check',
  "(email IS NOT NULL AND email != '') OR (phone IS NOT NULL AND phone != '')",
)
export class User {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({
    name: 'username',
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: true,
    comment: '登录名',
  })
  username: string;

  @Column({
    name: 'password',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '密码Hash',
  })
  password: string;

  @Column({
    name: 'nickname',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '用户昵称/真实名称',
  })
  nickname: string;

  @Column({
    name: 'role_ids',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '角色ID列表',
  })
  roleIds: string;

  @Column({
    name: 'status',
    type: 'tinyint',
    width: 1,
    nullable: true,
    comment: '状态 0:禁用 1:启用',
  })
  status: number;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 255,
    nullable: false,
    comment: '邮箱',
  })
  email: string;

  @Column({
    name: 'phone',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '手机号',
  })
  phone: string;

  @Column({ name: 'create_by', type: 'varchar', length: 255, nullable: true })
  createBy: string;

  @Column({
    name: 'create_time',
    type: 'datetime',
    nullable: true,
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  createTime: Date;

  @BeforeInsert()
  @BeforeUpdate()
  validateEmailOrPhone() {
    if (
      (!this.email || this.email.trim() === '') &&
      (!this.phone || this.phone.trim() === '')
    ) {
      throw new Error('邮箱或手机号至少需要提供一个');
    }
  }
}
