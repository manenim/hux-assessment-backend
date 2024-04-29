import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';

const EXPIRY_TIME = 200000 * 1000;

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  createTokens(user: User) {
    const payload = {
      sub: user.id,
      name: user.firstname,
      admin: user.lastname,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '5h',
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '24h',
    });
    const expiresIn = new Date().setTime(new Date().getTime() + EXPIRY_TIME)

    return { accessToken, refreshToken, expiresIn };
  }

  async refreshToken(user: any) {
    const payload = {
      username: user.username,
      sub: user.sub,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: '20s',
        secret: process.env.JWT_SECRET,
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: process.env.JWT_SECRET,
      }),
      expiresIn: new Date().setTime(new Date().getTime() + EXPIRY_TIME),
    };
  }

}
