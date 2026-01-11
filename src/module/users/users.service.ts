import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { PasswordService } from 'src/common/utils/password';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly passwordService: PasswordService,
  ) {}

  async register(dto: CreateUserDto) {
    if (
      await this.userRepository.findOne({ where: { userName: dto.userName } })
    ) {
      throw new Error('用户名已存在');
    }
    if (await this.userRepository.findOne({ where: { email: dto.email } })) {
      throw new Error('邮箱已存在');
    }
    if (await this.userRepository.findOne({ where: { phone: dto.phone } })) {
      throw new Error('手机号已存在');
    }
    const hashVal = await this.passwordService.hashPassword(dto.password);
    const user = this.userRepository.create({
      ...dto,
      password: hashVal,
    });
    return this.userRepository.save(user);
  }

  async login(userName: string, plainPassword: string) {
    const user = await this.userRepository.findOne({ where: { userName } });
    if (!user) return null;

    const ok = await this.passwordService.verifyPassword(
      plainPassword,
      user.password,
    );
    return ok ? user : null;
  }

  async findAll(pageNum: number, pageSize: number) {
    const [users, total] = await this.userRepository.findAndCount({
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
    });
    return {
      data: users,
      total,
    };
  }

  async findOne(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async delete(id: number) {
    return this.userRepository.delete(id);
  }
}
