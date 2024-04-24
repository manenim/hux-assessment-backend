import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';

const EXPIRE_TIME = 20 * 1000;

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
      expiresIn: '1h',
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '24h',
    });
    const expiresIn = new Date().setTime(new Date().getTime() + EXPIRE_TIME)

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
        secret: process.env.jwtSecretKey,
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: process.env.jwtRefreshTokenKey,
      }),
      expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
    };
  }

}
