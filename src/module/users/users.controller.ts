import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Query,
  Delete,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { PasswordService } from 'src/common/utils/password';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Controller('users')
export class UsersController {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
    private readonly passwordService: PasswordService, // ✅ 注入
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.repo.save(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginUserDto) {
    return this.passwordService.verifyPassword(
      loginDto.password,
      loginDto.userName,
    );
  }

  @Get('user')
  queryAll(
    @Query('pageNum') pageNum: string,
    @Query('pageSize') pageSize: string,
  ) {
    return this.repo.find({
      skip: (Number(pageNum) - 1) * Number(pageSize),
      take: Number(pageSize),
    });
  }

  @Get('user/:id')
  queryOne(@Param('id') id: string) {
    return this.repo.findOne({ where: { id: Number(id) } });
  }

  @Delete('user/:id')
  delete(@Param('id') id: string) {
    return this.repo.delete(Number(id));
  }
}
