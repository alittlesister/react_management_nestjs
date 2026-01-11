// src/common/entities/base.entity.ts
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

/**
 * 基础实体类
 * 所有实体都应继承此类
 */
export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, comment: '创建人' })
  created_by: string;

  @Column({ nullable: true, comment: '更新人' })
  updated_by: string;

  @CreateDateColumn({ type: 'timestamp', comment: '创建时间' })
  create_time: Date;

  @UpdateDateColumn({ type: 'timestamp', comment: '更新时间' })
  update_time: Date;
}
