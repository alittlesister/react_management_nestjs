import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import {
  PasswordService,
  PaginationHelper,
  QueryBuilderHelper,
} from '../../common';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly passwordService: PasswordService,
    private readonly paginationHelper: PaginationHelper,
    private readonly queryBuilder: QueryBuilderHelper,
  ) {}

  /**
   * 用户注册
   */
  async register(dto: CreateUserDto) {
    // 检查用户名是否存在
    const existingUser = await this.userRepository.findOne({
      where: { userName: dto.userName },
    });
    if (existingUser) {
      throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST);
    }

    // 检查邮箱是否存在
    if (dto.email) {
      const existingEmail = await this.userRepository.findOne({
        where: { email: dto.email },
      });
      if (existingEmail) {
        throw new HttpException('邮箱已存在', HttpStatus.BAD_REQUEST);
      }
    }

    // 检查手机号是否存在
    if (dto.phone) {
      const existingPhone = await this.userRepository.findOne({
        where: { phone: dto.phone },
      });
      if (existingPhone) {
        throw new HttpException('手机号已存在', HttpStatus.BAD_REQUEST);
      }
    }

    // 加密密码
    const hashedPassword = await this.passwordService.hashPassword(
      dto.password,
    );

    // 创建用户
    const user = this.userRepository.create({
      ...dto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    // 返回时移除密码字段
    const { password, ...result } = savedUser;
    return result;
  }

  /**
   * 用户登录
   */
  async login(userName: string, plainPassword: string) {
    const user = await this.userRepository.findOne({ where: { userName } });

    if (!user) {
      throw new HttpException('用户名或密码错误', HttpStatus.UNAUTHORIZED);
    }

    if (!user.isActive) {
      throw new HttpException('账号已被禁用', HttpStatus.FORBIDDEN);
    }

    const isPasswordValid = await this.passwordService.verifyPassword(
      plainPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('用户名或密码错误', HttpStatus.UNAUTHORIZED);
    }

    // 返回时移除密码字段
    const { password, ...result } = user;
    return result;
  }

  /**
   * 分页查询用户列表
   */
  async findAll(pageNum: number, pageSize: number) {
    // 验证分页参数
    const pagination = this.paginationHelper.validate(pageNum, pageSize);

    const [users, total] = await this.userRepository.findAndCount({
      skip: this.paginationHelper.getSkip(pagination.pageNum, pagination.pageSize),
      take: this.paginationHelper.getTake(pagination.pageSize),
      select: ['id', 'userName', 'nickName', 'email', 'phone', 'isActive', 'create_time', 'update_time'],
      order: { create_time: 'DESC' },
    });

    return this.paginationHelper.create(users, total, pagination);
  }

  /**
   * 根据ID查询用户
   */
  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'userName', 'nickName', 'email', 'phone', 'isActive', 'create_time', 'update_time'],
    });

    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  /**
   * 删除用户
   */
  async delete(id: number) {
    const user = await this.findOne(id);

    await this.userRepository.remove(user);

    return { message: '删除成功' };
  }

  /**
   * 根据用户名查找用户（用于认证）
   */
  async findByUserName(userName: string) {
    return this.userRepository.findOne({ where: { userName } });
  }
}
