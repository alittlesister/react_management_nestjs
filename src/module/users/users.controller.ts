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
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Public } from '../../common';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * 用户注册
   */
  @Public()
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto);
  }

  /**
   * 用户登录
   */
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginUserDto) {
    return this.usersService.login(loginDto.userName, loginDto.password);
  }

  /**
   * 获取用户列表（分页）
   */
  @Get()
  async findAll(
    @Query('pageNum', new ParseIntPipe({ optional: true })) pageNum = 1,
    @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize = 10,
  ) {
    return this.usersService.findAll(pageNum, pageSize);
  }

  /**
   * 获取单个用户
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  /**
   * 删除用户
   */
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.delete(id);
  }
}
