import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IQueryUser } from './interfaces/user';
import { Request } from 'express';
import { Req } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getUserAuth(@Req() req: Request<IQueryUser>): string[] {
    return this.authService.getUserAuth(req);
  }
}
