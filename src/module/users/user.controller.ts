import { Controller, Get, Param, Query } from '@nestjs/common';
import { UserService } from './user.service';
// import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/list')
  // @UseGuards(JwtAuthGuard)
  async findAll() {
    try {
      return await this.userService.findAll();
    } catch (error) {
      // 这里可以根据需要记录日志
      console.error(error);
      return {
        statusCode: 500,
        message: 'Internal server error',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        error: error?.message || '服务器内部错误',
      };
    }
  }

  @Get('/')
  // @UseGuards(JwtAuthGuard)
  async findPage(@Query() query: any) {
    try {
      console.log(query, '##');
      return await this.userService.findAll();
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Internal server error',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        error: error?.message || '服务器内部错误',
      };
    }
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.userService.findOne(parseInt(id));
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Internal server error',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        error: error?.message || '服务器内部错误',
      };
    }
  }
}
