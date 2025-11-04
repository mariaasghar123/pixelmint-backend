/* eslint-disable prettier/prettier */
import { Controller,Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  // ✅ POST /auth/signup
  @Post('signup')
  async signUp(@Body() body: { fullName: string; username: string; email: string; phone: string; password: string }) {
    return this.authService.signUp(
      body.fullName,
      body.username,
      body.email,
      body.phone,
      body.password,
    );
  }
   @Get('login')
  getLoginMessage() {
    return { message: 'Login route is working but use POST method for actual login.' };
  }

  // ✅ POST /auth/login
  @Post('login')
  async signIn(@Body() body: { email: string; password: string }) {
    return this.authService.signIn(body.email, body.password);
  }
}
