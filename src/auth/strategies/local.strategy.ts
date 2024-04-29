import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Strategy } from 'passport-local';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      usernameField: 'email',
    });
  }
  @ApiOperation({ summary: 'Log in' })
  @ApiResponse({
    status: 200,
    description: 'Log in a user',
  })
  public async validate(email: string, password: string) {
    console.log(email, password);
    const user = await this.usersService.verifyEmailAndPassword(
      email,
      password,
    );
    return user;
  }
}
