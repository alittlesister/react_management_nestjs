// 用户基础接口
export interface IUser {
  id: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  avatar: string;
  role: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

// 创建用户接口（不需要传ID）
export type ICreateUser = Omit<IUser, 'id' | 'createdAt' | 'updatedAt'> & {
  email?: string;
  phone?: string;
  avatar?: string;
  role?: string;
  status?: string;
};

// 更新用户接口（必须传ID，其他字段可选）
export type IUpdateUser = Pick<IUser, 'id'> & Partial<Omit<IUser, 'id'>>;

// 删除用户接口（只需要ID）
export type IDeleteUser = Pick<IUser, 'id'>;

// 查询用户接口（必须传ID，其他参数可选）
export type IQueryUser = Pick<IUser, 'id'> & Partial<Omit<IUser, 'password'>>;
