import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IQueryUser, IUser } from './interfaces/user';
// import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  login(user: IUser) {
    const payload = {
      username: user.username,
      sub: user.id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  getUserAuth(req: Request<IQueryUser>): string[] {
    console.log(req.query, 'req');
    const { id } = req.query;
    return ['user:list', 'user:add', 'user:delete'];
  }


  async validateUser(payload: { [x: string]: unknown }) {
    return Promise.resolve({ userId: payload.sub, username: payload.username });
  }
}
