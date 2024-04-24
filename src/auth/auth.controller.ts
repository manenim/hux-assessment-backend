import {
  ClassSerializerInterceptor,
  Controller,
  Post,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshJwtGuard } from './guards/refresh.guard';

const EXPIRES_TIME = 20 * 1000;

@SerializeOptions({ strategy: 'exposeAll' })
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(LocalAuthGuard)
  login(@CurrentUser() user: User) {
    const tokens = this.authService.createTokens(user);
    console.log('ran', tokens);
    return {
      message: 'user logged in successfully',
      status: 200,
      user,
      tokens,
    };
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refreshToken(@Request() req) {
    console.log('refreshed');

    return await this.authService.refreshToken(req.user);
  }
}
