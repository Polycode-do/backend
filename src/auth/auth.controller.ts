import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { User } from 'src/models/User';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoaclAuthGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LoaclAuthGuard)
  @Post('login')
  async login(@Request() req) {
    const access_token = await this.authService.login(req.user as User);

    return { access_token };
  }

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    const access_token = await this.authService.register(registerUserDto);

    return { access_token };
  }
}
